# Issue-tracker

Internal bug/ticket tracker app. See `CLAUDE.md` and `bug-tracker-project-plan.md` for the full project plan.

## Azure SQL Database Setup

These are the steps to create and connect to the Azure SQL Database (Free Offer tier) for this project.

### 1. Prerequisites

- An Azure account (personal/free account recommended — a work/organizational account may not give you Owner permissions).
- [Azure Data Studio](https://learn.microsoft.com/en-us/azure-data-studio/download-azure-data-studio) (or SSMS on Windows) to connect and test.

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
     - Authentication method: **SQL authentication** — set an admin username and password (save these safely, you'll need them for the connection string).
   - **Elastic pool?** → No.
   - **Compute + storage** → **Configure database** → select the **Free offer** tier.
4. **Networking** tab → set "Allow Azure services to access this server" to **Yes**, and add your current client IP (button: "Add current client IP").
5. **Review + Create**.

### 3. Get the connection string

1. Go to the SQL **Database** resource (not the server) → **Connection strings** (left menu, under Settings).
2. Copy the **ADO.NET** connection string.
3. Replace the `<username>` and `<password>` placeholders with your actual admin credentials.
4. **Do not commit this connection string to Git.** It will be stored via user-secrets / a gitignored config file when wired into the .NET project.

### 4. Test the connection

Using the SQL Server (mssql) extension in VS Code:

1. Open the extension's server explorer → **Add Connection** (or the `+` icon).
2. Server: `<your-server-name>.database.windows.net`
3. Authentication type: SQL Login
4. Username / Password: your admin credentials
5. Database: `bugtracker-db`
6. Connect.

If it connects, you should see the database, tables, and views in the extension's object explorer.

### Troubleshooting

- **"You do not have permissions to create resource groups under subscription ..."**
  Check Portal → Subscriptions → your subscription → **Status** field is "Active" (not Disabled/Pending). Also confirm the correct directory/tenant is selected (top-right directory switcher). Can also indicate the subscription is on an organizational tenant without Owner/Contributor rights — using a personal account avoids this.

- **"Your subscription does not have access to create a server in the selected region."**
  Free Trial subscriptions have inconsistent region capacity. Just try a different, more common region (e.g. East US, West Europe, Southeast Asia) from the dropdown — no support ticket needed.

- **Connection timeout / firewall error when connecting locally.**
  Your client IP may have changed or wasn't added. Go to the SQL **server** resource → **Networking** → add/refresh your current client IP.
