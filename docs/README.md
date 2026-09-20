# DinoPOS Documentation

This documentation describes the frontend that currently runs, the rules extracted from its code, and proposed contracts for a future backend. Implemented behavior is the source of truth. Historical design and migration specifications are retained in `archive/` but are not active requirements.

## Start here

- [Current structure audit](audit/current-structure.md)
- [Feature and route inventory](audit/feature-inventory.md)
- [Refactoring plan](audit/refactoring-plan.md)
- [Open product questions](open-questions.md)

## Architecture

- [Project structure](architecture/project-structure.md)
- [Frontend architecture](architecture/frontend-architecture.md)
- [Module map](architecture/module-map.md)
- [Data flow](architecture/data-flow.md)
- [State management](architecture/state-management.md)
- [Routing](architecture/routing.md)
- [Localization](architecture/localization.md)
- [Integration boundaries](architecture/integration-boundaries.md)
- [Retail OS UI foundation](architecture/retail-os-ui-foundation.md)
- [Approved Dashboard foundation](architecture/dashboard-visual-foundation.md)

## Product modules

- [Analytics](modules/analytics.md)
- [Dashboard](modules/dashboard.md)
- [Checkout](modules/checkout.md)
- [Catalog](modules/catalog.md)
- [Inventory](modules/inventory.md)
- [Customers](modules/customers.md)
- [Sales](modules/sales.md)
- [Returns](modules/returns.md)
- [Suppliers](modules/suppliers.md)
- [Holds](modules/holds.md)
- [Register and shifts](modules/register.md)
- [Operations records](modules/operations.md)
- [Reports](modules/reports.md)
- [Session, stores, and employees](modules/session.md)
- [Settings](modules/settings.md)

Catalog import is documented in Catalog; drafts are documented in Checkout; transfers and stocktakes are documented in Inventory. Authentication is not documented as a current module because it is not implemented.

## Contracts and decisions

- [Future API conventions](contracts/api-conventions.md)
- [ADR 0001: feature-module architecture](decisions/0001-feature-module-architecture.md)
- [ADR 0002: browser persistence boundary](decisions/0002-browser-persistence-boundary.md)
- [ADR 0003: future API boundary](decisions/0003-future-api-boundary.md)
- [Diagram index](diagrams/README.md)
- [Historical archive](archive/README.md)

## Documentation rules

1. Mark business rules as `Confirmed`, `Inferred`, `Open question`, or `Conflict`.
2. Update a module document in the same change that alters its entity, state, route, or flow.
3. Keep proposed API contracts implementation-neutral; do not add server code here.
4. Preserve JSON examples when changing field names so frontend and future backend discussions remain concrete.
5. Move superseded material to `archive/`; do not silently delete it or present it as current.
6. Re-run `pnpm check` after changes to paths, module entry points, persistence, or calculations.
