# Issue Tracker

An internal bug/ticket tracker for a small team, built as a hands-on learning
project: Angular (standalone components + signals) on the frontend, .NET
WebAPI + EF Core on the backend, Azure SQL as the database, and JWT-based
auth with a simple Admin/User permission model.

Bugs are tracked per **variant** (e.g. DE, AT, FR, DELF7) and go through a
**status** lifecycle, with an **impact** rating, an assigned owner, and
affected/fixed build tracking. Admins can manage team members' roles and the
Status/Impact/Variant/Build lookup values from an Admin Settings page.

See [`bug-tracker-project-plan.md`](./bug-tracker-project-plan.md) for the
full staged build plan and [`CLAUDE.md`](./CLAUDE.md) for the ground rules
this project was built under.

## Tech stack

| Layer    | Tech |
|----------|------|
| Frontend | Angular 20 (standalone components, Signals, new `@if`/`@for` control flow), Reactive Forms, RxJS |
| Backend  | .NET 10 WebAPI, EF Core, ASP.NET Core JWT Bearer auth |
| Database | Azure SQL Database (Free Offer tier) |
| Hosting  | Azure Static Web Apps (frontend) + Azure App Service, Linux F1 tier (backend) |
| Icons    | [@lucide/angular](https://www.npmjs.com/package/@lucide/angular) |

## Project structure

```
client/issue-tracker-ui/   Angular app
server/issue-tracker-server/   .NET WebAPI
```

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS) + npm
- [Angular CLI](https://angular.dev/tools/cli) — `npm install -g @angular/cli`
- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- An Azure SQL Database to connect to (see [Provisioning your own Azure SQL
  Database](#provisioning-your-own-azure-sql-database-from-scratch) below if
  you don't have one yet) — Azure Data Studio or SSMS is handy for poking at
  the data directly.

## Backend setup (`server/issue-tracker-server`)

### 1. Configure secrets

The backend needs two secrets that are **not** committed to the repo:

- `ConnectionStrings:DefaultConnection` — your Azure SQL connection string
- `Jwt:SigningKey` — any long random string, used to sign JWTs

Locally, these are stored via [.NET user-secrets](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets)
(already wired up via the `UserSecretsId` in the `.csproj`):

```bash
cd server/issue-tracker-server
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "<your connection string>"
dotnet user-secrets set "Jwt:SigningKey" "<a long random string>"
```

Non-secret JWT settings (issuer, audience, token expiry) live in
`appsettings.json` and don't need to be duplicated.

### 2. Apply migrations

```bash
dotnet tool install --global dotnet-ef   # first time only
dotnet ef database update
```

This creates the schema (and seeds the default Status/Impact/Variant lookup
rows) against whichever connection string is currently configured.

### 3. Run it

```bash
dotnet run
```

By default this serves the API at `http://localhost:5288` (see
`Properties/launchSettings.json`). Swagger/OpenAPI is available at `/openapi`
in Development.

### 4. Create the first Admin

Signup always creates a regular **User** — there's no bootstrap flow, by
design, since Admin-only actions (like promoting other users) need an Admin
to already exist. After signing up your first account through the UI,
promote it to Admin directly in the database:

```sql
UPDATE Users SET Role = 1 WHERE Username = '<your username>';
```

(`Role = 1` is Admin, `0` is User — see `Models/Role.cs`.) From then on, use
the Admin Settings page in the app to promote/demote everyone else.

## Frontend setup (`client/issue-tracker-ui`)

```bash
cd client/issue-tracker-ui
npm install
npm start        # ng serve — http://localhost:4200
```

The dev build points at `http://localhost:5288/api` (see
`src/environments/environment.ts`) — make sure the backend is running first.
`npm run build` produces a production build using
`src/environments/environment.prod.ts` instead (the deployed API URL).

## Running tests

```bash
cd server/issue-tracker-server && dotnet test
cd client/issue-tracker-ui && npm test
```

## Deployment

- **Backend** — Azure App Service (Linux, F1 free tier). Published via zip
  deploy:
  ```bash
  dotnet publish -c Release -o ./publish
  cd publish && zip -r ../deploy.zip . && cd ..
  az webapp deploy --resource-group <rg> --name <app-name> --src-path deploy.zip --type zip
  ```
  Secrets in production are set as App Service **Environment Variables**
  (Azure's `__` separator maps to .NET config's `:`), e.g.
  `ConnectionStrings__DefaultConnection` and `Jwt__SigningKey`. The Azure SQL
  server's Networking blade must have "Allow Azure services and resources to
  access this server" enabled so the App Service can reach it.

- **Frontend** — Azure Static Web Apps (Free tier), deployed via the SWA
  CLI:
  ```bash
  cd client/issue-tracker-ui
  npm run build
  npx @azure/static-web-apps-cli deploy ./dist/issue-tracker-ui/browser --deployment-token <token>
  ```
  `staticwebapp.config.json` handles the SPA fallback so client-side routes
  survive a page refresh.

- CORS on the backend is restricted to the deployed Static Web App origin
  plus `localhost:4200` (see `Program.cs`) — update it if you deploy your
  own copy under a different URL.

## Live deployment

- Frontend: https://green-hill-0b65a570f.6.azurestaticapps.net
- Backend API: https://issue-tracker-api-aphgdzavd4cva3ad.centralus-01.azurewebsites.net/api

---

## Provisioning your own Azure SQL Database from scratch

These are the steps to create and connect to a new Azure SQL Database (Free
Offer tier), if you don't already have one to point the backend at.

### 1. Prerequisites

- An Azure account (personal/free account recommended — a work/organizational
  account may not give you Owner permissions).
- [Azure Data Studio](https://learn.microsoft.com/en-us/azure-data-studio/download-azure-data-studio)
  (or SSMS on Windows) to connect and test.

### 2. Create the resource group and SQL Database

1. Sign in at [portal.azure.com](https://portal.azure.com).
2. **Create a resource** → search **"SQL Database"** → **Create**.
3. Fill in:
   - **Subscription** — your Free Trial / Pay-As-You-Go subscription.
   - **Resource group** — create new, e.g. `bugtracker-rg`.
   - **Database name** — e.g. `bugtracker-db`.
   - **Server** — create new:
     - Server name: must be globally unique, e.g. `bugtracker-sql-yourname`.
     - Location: pick a region close to you.
     - Authentication method: **SQL authentication** — set an admin username
       and password (save these safely, you'll need them for the connection
       string).
   - **Elastic pool?** → No.
   - **Compute + storage** → **Configure database** → select the **Free
     offer** tier.
4. **Networking** tab → set "Allow Azure services to access this server" to
   **Yes**, and add your current client IP (button: "Add current client
   IP").
5. **Review + Create**.

### 3. Get the connection string

1. Go to the SQL **Database** resource (not the server) → **Connection
   strings** (left menu, under Settings).
2. Copy the **ADO.NET** connection string.
3. Replace the `<username>` and `<password>` placeholders with your actual
   admin credentials.
4. **Do not commit this connection string to Git.** Store it via
   `dotnet user-secrets` locally (see [Backend setup](#backend-setup-serverissue-tracker-server)
   above) or as an App Service environment variable in production.

### 4. Test the connection

Using the SQL Server (mssql) extension in VS Code, or Azure Data Studio:

1. Add a new connection.
2. Server: `<your-server-name>.database.windows.net`
3. Authentication type: SQL Login
4. Username / Password: your admin credentials
5. Database: `bugtracker-db`
6. Connect.

If it connects, you should see the database, tables, and views in the
object explorer.

### Troubleshooting

- **"You do not have permissions to create resource groups under
  subscription ..."**
  Check Portal → Subscriptions → your subscription → **Status** field is
  "Active" (not Disabled/Pending). Also confirm the correct directory/tenant
  is selected (top-right directory switcher). Can also indicate the
  subscription is on an organizational tenant without Owner/Contributor
  rights — using a personal account avoids this.

- **"Your subscription does not have access to create a server in the
  selected region."**
  Free Trial subscriptions have inconsistent region capacity. Just try a
  different, more common region (e.g. East US, West Europe, Southeast Asia)
  from the dropdown — no support ticket needed.

- **Connection timeout / firewall error when connecting locally.**
  Your client IP may have changed or wasn't added. Go to the SQL **server**
  resource → **Networking** → add/refresh your current client IP.

- **App Service can't reach the database (works locally, fails when
  deployed).**
  The SQL server's **Networking** blade needs "Allow Azure services and
  resources to access this server" set to **Yes** — the per-IP firewall
  rules only cover your own machine, not Azure's backend infrastructure.
