# Project: Bug/Ticket Tracker App

## What this is
Internal bug tracking tool for a 10-15 person team. Bugs are tracked per
variant (DE, AT, FR, DELF7). Built purely for learning — not a commercial
product.

Full staged plan: @bug-tracker-project-plan.md

## Tech stack
- Frontend: Angular
- Backend: .NET WebAPI, EF Core
- Database: Azure SQL Database (Free Offer tier)
- Auth: JWT (simple username/password)
- Hosting: Azure Static Web Apps (frontend) + Azure App Service F1 (backend)

## Learning mode — IMPORTANT
I am learning full-stack dev by building this. Follow these rules on every task:

- Before writing any code, explain your approach in plain terms first.
  Wait for me to say "go" before implementing.
- Work on ONE micro-task at a time (see plan file). Do not jump ahead to
  later tasks or stages without me asking.
- After implementing, briefly explain what the code does and why you chose
  that approach — assume I want to understand it, not just have it work.
- If there's a simpler way vs. a more "correct"/idiomatic way, tell me both
  and explain the tradeoff. Don't silently pick one.
- Don't auto-fix unrelated issues you notice — mention them, let me decide.

## Workflow
- Run the app/tests yourself after each change to verify it works before
  telling me it's done.
- Suggest a git commit after each completed micro-task, with a message
  describing what was learned/built.

## Code style
- Keep things simple over clever — this is a learning project, not a
  production system optimizing for scale.
- Prefer standard/idiomatic Angular and .NET patterns over custom
  abstractions, since the goal is learning the frameworks properly.

## Commands
_(fill these in once the projects are scaffolded in Stage 1)_
- Frontend dev server: `ng serve`
- Backend dev server: `dotnet run`
- Run backend tests: `dotnet test`
- EF Core migration: `dotnet ef migrations add <Name>`
