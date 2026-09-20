# Reports Module

## Purpose

Reports provides deeper operational analysis for sales, products, tenders, cashiers, customer balances, supplier balances, and purchase orders using the approved Dashboard analytical language. It does not mutate product transactions.

## Related Screens

- `/reports`: filters, sales chart, top products/services, tender share, cashier table, balance and purchase-order summaries, export action.
- Public entry: `modules/reports/index.ts`.

## Functionality

Select stores/period/custom range; aggregate revenue/cost/profit/orders; inspect charts/tooltips; list top five items; calculate payment-method shares; compare cashier results; inspect debt/prepayment/supplier/purchase-order totals; sort/page; simulate export; show no-data and export loading/success states.

## Entities and Fields

Reports owns no entities. It consumes `Sale`, `Product`, `Customer`, `PurchaseOrder`, `Store`, and derived `AnalyticsPoint`, ranking, share, and summary rows.

## Business Rules

| Status | Rule |
| --- | --- |
| Confirmed | Sales are filtered by selected store IDs and inclusive calendar range. |
| Confirmed | Cost equals current catalog cost × historical sold quantity; profit = revenue - cost. |
| Confirmed | Top products use gross line value and return five rows. |
| Confirmed | Payment and cashier totals aggregate filtered sales. |
| Confirmed | Customer/supplier balance panels use current balances, not historical snapshots. |
| Confirmed | Export currently only displays loading/success feedback; no file is created. |
| Conflict | Historical cost/profit and balances can change independently of the selected historical period. |
| Open question | Return/tax/discount attribution and official report definitions. |

## States and Transitions

Filters cause derived recalculation. Export moves `idle -> loading -> success` in UI only. Empty filtered sales produce no-data chart/table states; there is no server error state today.

## User Flows

**Analyze:** manager selects scope/range, charts and tables recalculate, hover/sort/page reveals detail. **Export:** manager requests export, simulated pending completes with toast; no artifact is saved.

## Current Data Handling

All data is read from Zustand/Local Storage and aggregated in the browser. Product cost is looked up at render time. Chart rendering uses shared ECharts wrappers. Filters are transient. No report snapshots, scheduled reports, or external accounting export exist.

## Future Frontend/Backend Contracts

### Report query and export

| Item | Proposal |
| --- | --- |
| Method/endpoint | `GET /api/v1/reports/sales`; `POST /api/v1/reports/exports` |
| Consumer | Reports screen |
| Parameters/body | stores, range, granularity, timezone, dimensions, metrics, format |
| Validation/errors | allowed stores/range/dimensions; `422 RANGE_TOO_LARGE`; `429`; export job failures |
| Permission/effects | `reports:read` / `reports:export`; export creates expiring artifact only |
| Idempotency/loading/retry | query cancellable/cacheable; export key recommended; poll job with bounded retry |

```json
{
  "storeIds": ["b1", "b2"],
  "range": { "from": "2026-09-01", "to": "2026-09-30" },
  "report": "sales-performance",
  "format": "xlsx",
  "locale": "en"
}
```

```json
{
  "data": { "jobId": "exp_01J...", "status": "queued", "expiresAt": null },
  "meta": { "requestId": "req_01J..." }
}
```

Completed job detail should provide a short-lived download URL. Historical sales lines must carry cost/tax/discount snapshots if financial reports are authoritative.

## Dependencies

Uses Analytics, Sales, Catalog, Customers, Operations, Session, and shared charts/tables. No module depends on Reports. Future analytics/report endpoints replace browser joins and calculations.

## Open Questions

Accounting definitions, return allocation, tax basis, historical cost, cashier attribution, export formats, retention, scheduling, and whether live/current balances belong in historical reports are unresolved.
