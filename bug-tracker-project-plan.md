# Bug Tracker App — Project Plan

**Stack:** Angular (frontend) + .NET WebAPI (backend) + Azure SQL Database
**Hosting:** Azure Static Web Apps + Azure App Service F1 + Azure SQL Free Offer
**Goal:** Learning by doing. Move one micro-task at a time.

---

## Stage 1: Project Setup

- [x] **1.1** Install prerequisites
  - Node.js, Angular CLI, .NET SDK, SQL client (Azure Data Studio or SSMS)
- [x] **1.2** Create a new Git repo
  - Mono-repo with `/client` and `/server` folders
- [x] **1.3** Scaffold Angular app
  - Inside `/client`, run `ng new`
- [x] **1.4** Scaffold .NET WebAPI project
  - Inside `/server`, run `dotnet new webapi`
- [x] **1.5** Run both locally
  - Confirm default pages/Swagger load
- [x] **1.6** Push initial commit to Git

---

## Stage 2: Database Design

- [x] **2.1** List out tables needed
  - Users, Bugs, Variants, Impacts, Statuses (lookup tables for Impact/Status keep values clean)
- [x] **2.2** Draw a simple ER diagram
  - Bug table with FKs to Variant/Impact/Status/User
- [x] **2.3** Create Azure SQL Database
  - Apply the Free Offer
- [x] **2.4** Get connection string
  - Test connection from local machine
- [x] **2.5** Install EF Core + SQL Server provider
  - In the .NET project
- [x] **2.6** Create EF Core models
  - Matching the ER diagram
- [x] **2.7** Create DbContext
  - Run first migration, verify tables appear in Azure SQL

---

## Stage 3: Backend — Auth

- [x] **3.1** Create User entity + migration
- [x] **3.2** Build Signup endpoint
  - Hash password, save user
- [x] **3.3** Build Login endpoint
  - Verify password, issue JWT
- [x] **3.4** Add JWT middleware
  - Protects endpoints
- [x] **3.5** Test both endpoints
  - Via Swagger/Postman

---

## Stage 4: Backend — Roles & Permissions (RBAC)

- [x] **4.1** Add `Role` (Admin/User) to User entity + migration
- [x] **4.2** Design Permissions model
  - Roles: Admin (Reader, Writer, Administration), User (Reader, Writer)
- [x] **4.3** Add permission checks to relevant endpoints
  - e.g. only Administration permission can add/edit Impacts, Statuses, Variants
- [x] **4.4** Include role/permissions in JWT claims
- [x] **4.5** Test permission enforcement
  - Via Swagger/Postman with different roles

---

## Stage 5: Backend — Refresh Tokens
_(Skipped for now — will revisit once frontend auth (Stage 7) surfaces the need for silent token renewal.)_

- [ ] **5.1** Design refresh token model
  - Token value, UserId, expiry, revoked flag; stored in a new RefreshTokens table
- [ ] **5.2** Issue a refresh token alongside the access token on login
- [ ] **5.3** Build "Refresh" endpoint
  - Exchange a valid refresh token for a new access token
- [ ] **5.4** Handle revocation
  - Invalidate refresh token on logout / reuse detection
- [ ] **5.5** Update frontend to silently refresh expired access tokens

---

## Stage 6: Backend — Bug CRUD API

- [x] **6.1** Create Bug entity + migration
  - Fields: BugId, Title, Description, AffectedBuild, Impact, Reporter, Responsible, Status, FixedBuild, Variant, ExpectedBehavior, Remarks
  - Also seeded Impacts/Variants/Statuses lookup data via `HasData`
- [x] **6.2** Build "Create Bug" endpoint
- [x] **6.3** Build "Get all bugs" endpoint
  - No filters yet
- [x] **6.4** Build "Update bug" endpoint
  - For status change, resolving
- [x] **6.5** Test all endpoints
  - Via Postman
- [x] **6.6** (Added) CRUD endpoints for Variants, Impacts, Statuses
  - GET open to any authorized user; POST/PUT/DELETE gated by `Administration` permission policy
- [x] **6.7** (Added) Build lookup table
  - `AffectedBuild`/`FixedBuild` on Bug changed from free-text strings to FKs into a new `Builds` table (global, not per-variant); `FixedBuildId` nullable since a bug may not be fixed yet

---

## Stage 7: Frontend — Auth Pages

- [x] **7.1** Create Login page + form
- [x] **7.2** Create Signup page + form
- [x] **7.3** Connect both to backend APIs
  - Also added backend CORS policy for the Angular dev origin (`localhost:4200`), fixing a preflight bug where `UseCors()` was called before `UseRouting()`
- [x] **7.4** Store JWT
  - Chose `localStorage` (see discussion — revisit alongside Stage 5 refresh tokens for the in-memory + httpOnly-cookie upgrade); redirects to `/bugs` on success via an HTTP interceptor that attaches the token to API requests
- [x] **7.5** Add route guard
  - `authGuard` protects `/bugs`, redirects to `/login` when not authenticated; verified with a placeholder landing component (full UI is Stage 8)

---

## Stage 8: Frontend — Landing Page (Basic)

- [x] **8.1** Create landing page component with a table
  - Topbar, profile chip w/ dropdown, responsive table (horizontal-scroll wrapper on narrow screens)
- [x] **8.2** Call "Get all bugs" API
  - Render rows; full-page dimmed overlay + centered loader while loading
- [x] **8.3** Add "New Bug" button + form
  - Wire to Create Bug API
  - Built as a shared Add/Edit modal component (reused by 8.4's edit flow); closes on Cancel/X/Esc only, not click-outside; icons via `@lucide/angular`
- [x] **8.4** Add status dropdown per row
  - Wire to Update Bug API; also added full Edit (click the Bug ID) reusing the same modal, since the backend Update endpoint accepts all fields, not just status

---

## Stage 9: Frontend — Admin Dashboard
_(Added — not in the original plan, pulled forward ahead of Stage 10 filtering)_

- [x] **9.1** Add `Color`/`Icon` to Status/Impact lookup tables (backend)
  - Migration backfills existing rows with their real values; enums now serialize as strings across the API
- [x] **9.2** Add `Role` to `UserResponse` + `PUT /api/users/{id}/role` endpoint
  - Administration-only; needed so the frontend can show/guard admin-only UI and promote/demote users
- [x] **9.3** Build Admin Dashboard UI
  - Tabs: Users, Statuses, Impacts, Variants, Affected Builds — matches provided mockup
  - Add **and** Edit (mockup only had Add) **and** Delete for every lookup type; Status/Impact include a color picker and a curated icon-dropdown picker with live preview
  - Self-demotion blocked (a lone Admin can't lock themselves out)
- [x] **9.4** Guard `/admin` route to Admins only
  - `adminGuard`; "Admin Settings" menu item only shown to Admins
- [x] **9.5** Retired the hardcoded frontend status/impact color+icon map
  - Table and modal now read `Color`/`Icon` straight from the database, fixing the gap where a newly-added custom status/impact would have rendered with no icon

---

## Stage 10: Filtering, Search, Count

- [ ] **10.1** Extend "Get all bugs" endpoint (backend)
  - Accept filter query params: variant, impact, status, reporter, responsible, fixedBuild
- [ ] **10.2** Add title/description search param (backend)
- [ ] **10.3** Build filter bar UI (frontend)
  - Dropdowns for each filter field
- [ ] **10.4** Build search box (frontend)
  - Wire both to API call
- [ ] **10.5** Add count section at top
  - Shows count of currently filtered results

---

## Stage 11: Deployment

- [x] **11.1** Create Azure App Service (F1) resource
  - `issue-tracker-api` in the `issue-tracker-app` resource group, Linux, .NET 10 (LTS); deployed manually via `az webapp deploy` (zip deploy) rather than CI/CD — GitHub Actions/Jenkins automation deferred to later
  - Connection string and JWT signing key set as App Service Environment Variables (`ConnectionStrings__DefaultConnection`, `Jwt__SigningKey`), read automatically by the existing `IConfiguration` code with no code changes
  - Had to enable "Allow Azure services and resources to access this server" on the SQL Server firewall so the App Service could reach the database
- [x] **11.2** Update backend CORS settings
  - Added the Static Web App origin to the existing hardcoded `WithOrigins(...)` list in `Program.cs` (chose to keep hardcoding over moving to config-driven origins, for simplicity)
- [x] **11.3** Create Azure Static Web App resource
  - `issue-tracker-ui`, Free tier, deployed manually via the SWA CLI (`swa deploy`) with a deployment token, not GitHub Actions
- [x] **11.4** Update frontend API base URL
  - Added `environment.prod.ts` + an `angular.json` `fileReplacements` entry on the `production` build configuration, pointing at the deployed backend URL
  - Also added `public/staticwebapp.config.json` with a `navigationFallback` rule — without it, refreshing any non-root route (e.g. `/login`) 404'd, since Azure was trying to resolve Angular client-side routes as real files
- [x] **11.5** Test end-to-end on deployed URLs
  - Confirmed live: signup/login, CORS, and page-refresh routing all working on the deployed frontend + backend

---

## Stage 12: Polish

- [ ] **12.1** Add form validation
  - Required fields, max lengths
- [ ] **12.2** Add basic error handling/toasts
  - On API failures
- [ ] **12.3** Add loading states/spinners
  - Bug list and modal submit already covered in Stage 8/9; sweep for anything left
- [ ] **12.4** Clean up UI styling
- [ ] **12.5** Write a short README
  - Setup + run instructions

---

*Move through tasks one at a time. Ask before starting a new stage if anything's unclear.*
