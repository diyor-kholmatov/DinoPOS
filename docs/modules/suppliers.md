# Suppliers Module

## Purpose

Suppliers presents supplier accounts and purchase orders and allows a manager to create a simple purchase order. Receiving, invoice reconciliation, supplier returns, and payments are outside the current implementation.

## Related Screens

- `/suppliers`: supplier and purchase-order work area with create dialog.
- Public entry: `modules/suppliers/index.ts`.

## Functionality

View suppliers/balances; sort/page purchase orders; create PO by supplier/store/product count/amount; display created/accepted/paid/return badges; show form validation, empty state, and success feedback.

## Entities and Fields

| Entity | Fields | Rules/display |
| --- | --- | --- |
| `Supplier` | ID, name, contact, phone, balance, active | balance current nonnegative seed value; active flag |
| `PurchaseOrder` | ID, supplier/store IDs, products count, ordered/received amounts, status, time | status created/accepted/paid/return |

## Business Rules

| Status | Rule |
| --- | --- |
| Confirmed | Supplier and store are required. |
| Confirmed | Products is a positive integer; ordered amount is positive. |
| Confirmed | New orders are inserted with zero received amount and `created` status. |
| Inferred | Supplier balance represents money owed, but no transaction ledger explains it. |
| Open question | State transitions, line items, receiving, partial delivery/payment, taxes, and currency. |

## States and Transitions

The record type permits `created`, `accepted`, `paid`, and `return`, but the current UI only creates records and displays seeded statuses. Permitted transitions are therefore an open question.

## User Flows

Manager opens Create PO, selects active supplier/store, enters product count and amount, validation runs, and a local `created` record is prepended. No inventory or supplier balance changes.

## Current Data Handling

Suppliers and purchase orders are seeded and persisted in `dinopos-v6-operations`. Store choices come from Session. No product lines, documents, receiving, accounting, or external supplier source exists.

## Future Frontend/Backend Contracts

### Create purchase order

| Item | Proposal |
| --- | --- |
| Method/endpoint | `POST /api/v1/purchase-orders` |
| Consumer | Suppliers screen |
| Validation/errors | active supplier/store/products, positive quantity/price; `404`, `409`, `422` |
| Permission/effects | `purchasing:create`; create auditable draft, no stock change until receipt |
| Idempotency/loading/retry | required; disable duplicate submit; retry same key |

```json
{
  "supplierId": "s2",
  "storeId": "b1",
  "lines": [{ "productId": "p5", "quantity": 10, "unitCost": 460000 }]
}
```

```json
{
  "data": { "id": "PO-1049", "status": "created", "orderedAmount": 4600000, "receivedAmount": 0, "version": 1 },
  "meta": { "requestId": "req_01J..." }
}
```

Queries: `GET /suppliers`, `GET /purchase-orders`; future receive/pay/return endpoints require separate idempotent commands.

## Dependencies

Uses Operations records, Session stores, and shared tables/forms. Reports reads supplier/PO values. Future Supplier/Purchasing APIs replace the mixed Operations persistence.

## Open Questions

PO lifecycle, product lines, receiving, invoice/payment ledger, balance sign, tax/currency, approvals, supplier returns, and document attachments are undefined.

