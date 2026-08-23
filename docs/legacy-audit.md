# Legacy Application Audit

## Preserved Workflows

| Area | Preserved behavior | React owner |
| --- | --- | --- |
| Checkout | product search, barcode entry, quantities, discount, customer, payment, receipt | `features/checkout` |
| Register | store lock while open, opening float, expected cash, fiscal queue | `session-store` |
| Catalog | products and services, stock by store, barcode uniqueness | `catalog-store` |
| Inventory | stock adjustments, movements, stocktakes, transfers | `features/inventory` |
| Customers | debt, prepayment, loyalty, transaction history | `customer-store` |
| Sales | immutable receipts, payment method, fiscal status | `sales-store` |
| Operations | suppliers, returns, drafts, holds, cash operations, shift history | domain stores |
| Preferences | locale, theme, rail, fiscalization, payment and receipt settings | session/settings stores |

## Business Rules

- A full-register payment requires an open shift.
- The active store cannot change during an open shift.
- Physical stock cannot become negative through a sale, adjustment, or transfer.
- Services are not decremented from inventory.
- Cash payments and cash operations update expected drawer cash.
- Held sales reserve available stock until redeemed or cancelled.
- Returns reference an existing sale and write compensating stock, balance, and cash records.
- Fiscal sales made offline enter a pending fiscal queue; non-fiscal mode is disclosed beside payment.
- Stored statuses remain stable codes and are translated only at the interface boundary.

## Persistence

The compatibility layer reads `retailos-unified-brief-v5-i18n`, writes the untouched source to `dinopos-v5-backup`, normalizes supported legacy records, and then persists the typed v6 domain stores. New modules keep their own versioned Local Storage keys rather than sharing a monolithic state object.

## UI/UX Findings Addressed

- Wide navigation became a persistent compact rail plus accessible mobile drawer.
- Repeated top-bar controls were moved into page context or the profile popover.
- Large normal-state banners became compact status bars and semantic badges.
- Alert colors are restricted to conditions requiring attention; chart colors use Data 1–5.
- Static charts became responsive ECharts views with legends and tooltips.
- Module-specific tables now share TanStack sorting, pagination, density, and state handling.
- Forms use React Hook Form and Zod, with field-level invalid states.
- Legacy screen files and the monolithic application script are no longer part of the source tree.
