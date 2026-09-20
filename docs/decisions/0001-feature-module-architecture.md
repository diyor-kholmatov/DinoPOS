# ADR 0001: Feature-Module Frontend Architecture

- Status: Accepted
- Date: 2026-09-20

## Context

Screens, schemas, and stores for one domain were split across `features`, `entities`, and global `stores`, making ownership and dependencies difficult to see.

## Decision

Move the web app under `apps/web`; colocate product behavior under `modules`; keep route files thin; keep reusable infrastructure under `shared`; expose module entry points; enforce boundaries and runtime-cycle checks in `pnpm check`.

## Consequences

Domain ownership is visible and future API adapters have a natural home. Some workflow modules intentionally depend on several model APIs. The legacy migration layer remains a documented exception until retired.
