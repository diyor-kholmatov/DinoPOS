# Sales Module

## Purpose

Sales owns the completed sale schema, append-only client store, and receipt-history screen. Sale creation is orchestrated by Checkout; refunds are handled by Returns.

## Related Screens

- `/sales`: summary, search, payment filter, export simulation, receipt detail dialog.
- Model entry: `modules/sales/model/index.ts`.

## Functionality

Search receipt/customer/cashier; filter tender; sort/page via shared table; calculate total revenue/fiscalized count/average receipt; inspect line items; simulate export; show fiscal/non-fiscal and empty states. The screen exposes no edit/delete operation.

## Entities and Fields

`Sale` contains `id`, `receiptNumber`, `createdAt`, `storeId`, `registerId`, `shiftId`, cashier/customer IDs/names, at least one `CartLine`, subtotal/discount/tax/total, `paymentMethod`, `fiscalized`, `fiscalId`, and literal status `completed`. Payment methods are cash/card/QR/transfer/debt/prepayment.

## Business Rules

| Status | Rule |
| --- | --- |
| Confirmed | Sale records are appended and are not editable/deletable in the UI. |
| Confirmed | A sale must have at least one positive-quantity line and nonnegative totals. |
| Confirmed | Status is always `completed` in the current schema. |
| Confirmed | Fiscal ID is populated only when fiscalization is enabled and the session is online. |
| Inferred | Historical line name/price/customer/cashier are snapshots intended to survive master-data changes. |
| Open question | Voids, cancellations, mixed tender, pending payments, fiscal retry states, and immutable audit requirements. |

## States and Transitions

The current sale lifecycle has only creation directly into `completed`. Return records do not mutate sale status or remaining returnable quantities.

## User Flows

**Browse receipt:** manager searches/filters, opens a row, reviews metadata/lines/total, and closes the dialog. **Create sale:** see the Checkout sequence; Sales receives the validated snapshot after all checks.

## Current Data Handling

Sales persist in `dinopos-v6-sales`; bootstrap provides demonstration records. Metrics and filters are browser calculations. Export is a timed UI success simulation; no file is generated. There is no remote receipt/fiscal/payment source.

## Future Frontend/Backend Contracts

### Query completed sales

| Item | Proposal |
| --- | --- |
| Method/endpoint | `GET /api/v1/sales` and `GET /api/v1/sales/{id}` |
| Consumer | Sales list/detail, Returns, Reports |
| Parameters | store/date/search/payment/fiscal status, sort, cursor/limit |
| Errors/status | `200`, `401/403`, `404` detail; query retries only for transient failures |
| Permission | `sales:read` scoped by store |

```json
{
  "data": [{
    "id": "sale_01J...",
    "receiptNumber": "R-10508",
    "createdAt": "2026-09-20T08:20:00Z",
    "storeId": "b1",
    "customer": { "id": "c1", "name": "Emily Carter" },
    "paymentMethod": "card",
    "total": 8405600,
    "currency": "UZS",
    "fiscalization": { "status": "completed", "fiscalId": "FISC-482103" },
    "version": 1
  }],
  "meta": { "requestId": "req_01J...", "page": { "nextCursor": null, "limit": 50, "total": 1 } }
}
```

Sale creation is specified in Checkout. Export should be an asynchronous `POST /sales/exports` job when volumes require it; retries are safe for queries/job status, while creation uses an idempotency key.

## Dependencies

Uses Session for locale/store context and shared tables/dialogs. Checkout writes Sales; Returns/Reports/Analytics/Customers reference sales. A future Sales API becomes the authoritative read model.

## Open Questions

Payment/fiscal state machines, receipt numbering, returnable balance, voids, audit retention, export format, and legal receipt fields are unresolved.
