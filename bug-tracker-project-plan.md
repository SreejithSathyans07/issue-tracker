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
- [ ] **3.3** Build Login endpoint
  - Verify password, issue JWT
- [ ] **3.4** Add JWT middleware
  - Protects endpoints
- [ ] **3.5** Test both endpoints
  - Via Swagger/Postman

---

## Stage 4: Backend — Roles & Permissions (RBAC)

- [ ] **4.1** Add `Role` (Admin/User) to User entity + migration
- [ ] **4.2** Design Permissions model
  - Roles: Admin (Reader, Writer, Administration), User (Reader, Writer)
- [ ] **4.3** Add permission checks to relevant endpoints
  - e.g. only Administration permission can add/edit Impacts, Statuses, Variants
- [ ] **4.4** Include role/permissions in JWT claims
- [ ] **4.5** Test permission enforcement
  - Via Swagger/Postman with different roles

---

## Stage 5: Backend — Bug CRUD API

- [ ] **5.1** Create Bug entity + migration
  - Fields: BugId, Title, Description, AffectedBuild, Impact, Reporter, Responsible, Status, FixedBuild, Variant
- [ ] **5.2** Build "Create Bug" endpoint
- [ ] **5.3** Build "Get all bugs" endpoint
  - No filters yet
- [ ] **5.4** Build "Update bug" endpoint
  - For status change, resolving
- [ ] **5.5** Test all endpoints
  - Via Swagger/Postman

---

## Stage 6: Frontend — Auth Pages

- [ ] **6.1** Create Login page + form
- [ ] **6.2** Create Signup page + form
- [ ] **6.3** Connect both to backend APIs
- [ ] **6.4** Store JWT
  - In memory or localStorage; redirect to landing page on success
- [ ] **6.5** Add route guard
  - Landing page requires login

---

## Stage 7: Frontend — Landing Page (Basic)

- [ ] **7.1** Create landing page component with a table
- [ ] **7.2** Call "Get all bugs" API
  - Render rows
- [ ] **7.3** Add "New Bug" button + form
  - Wire to Create Bug API
- [ ] **7.4** Add status dropdown per row
  - Wire to Update Bug API

---

## Stage 8: Filtering, Search, Count

- [ ] **8.1** Extend "Get all bugs" endpoint (backend)
  - Accept filter query params: variant, impact, status, reporter, responsible, fixedBuild
- [ ] **8.2** Add title/description search param (backend)
- [ ] **8.3** Build filter bar UI (frontend)
  - Dropdowns for each filter field
- [ ] **8.4** Build search box (frontend)
  - Wire both to API call
- [ ] **8.5** Add count section at top
  - Shows count of currently filtered results

---

## Stage 9: Deployment

- [ ] **9.1** Create Azure App Service (F1) resource
  - Deploy backend
- [ ] **9.2** Update backend CORS settings
  - Allow frontend domain
- [ ] **9.3** Create Azure Static Web App resource
  - Deploy frontend
- [ ] **9.4** Update frontend API base URL
  - Point to deployed backend
- [ ] **9.5** Test end-to-end on deployed URLs

---

## Stage 10: Polish

- [ ] **10.1** Add form validation
  - Required fields, max lengths
- [ ] **10.2** Add basic error handling/toasts
  - On API failures
- [ ] **10.3** Add loading states/spinners
- [ ] **10.4** Clean up UI styling
- [ ] **10.5** Write a short README
  - Setup + run instructions

---

*Move through tasks one at a time. Ask before starting a new stage if anything's unclear.*
