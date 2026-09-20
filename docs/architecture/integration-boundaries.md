# Integration Boundaries

## Current adapters

- Browser persistence: `shared/persistence/storage.ts`.
- Environment/base path: `shared/config/environment.ts`.
- Legacy data input: `shared/legacy`.
- Date/number output: `shared/lib/format.ts`.
- ECharts: wrapped by shared data components.

There is no API client, server authentication, remote database, payment gateway, fiscal device SDK, file parser, printer driver, or scanner SDK. Barcode entry currently uses keyboard input.

## Future service boundaries

| Boundary | Commands/queries | Critical concerns |
| --- | --- | --- |
| Identity | session, user, role, permissions | tenant/store scope, expiry, audit |
| Catalog | products, services, prices | uniqueness, concurrency |
| Inventory | stock, movement, transfer, stocktake | atomicity, reservations |
| Checkout/Sales | quote, complete sale, receipt | idempotency, fiscal/payment state |
| Customers | profile, balance, ledger | immutable financial entries |
| Register | shift, drawer operations | one active shift, reconciliation |
| Operations | suppliers, purchase orders, holds, returns | status transitions, permissions |
| Analytics | aggregates and exports | timezone, historical snapshots |
| Settings | tenant/device configuration | role-controlled mutation |

Future adapters should be module-owned and expose typed commands/queries to screens. Shared code may provide a transport client but must not understand product entities.
