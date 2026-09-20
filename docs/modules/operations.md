# Operations Records Module

## Purpose

Operations is the current persisted record repository for suppliers, purchase orders, transfers, returns, holds, cash operations, shift history, stocktakes, and imports. It exposes typed append/status actions but no route. It is a pragmatic prototype aggregate, not a future backend domain boundary.

## Related Screens

Consumed by Catalog Import, Inventory, Transfers, Suppliers, Returns, Holds, Register, and Reports. Public/model entries: `modules/operations/index.ts`, `modules/operations/model/index.ts`.

## Functionality

Provide seeded records; append PO/transfer/return/hold/cash/shift/stocktake/import; update transfer and hold statuses; persist all collections; expose record types and cleanly separated seed fixtures.

## Entities and Fields

The type source is `modules/operations/model/types.ts`: `Supplier`, `PurchaseOrder`, `TransferRecord`, `ReturnRecord`, `HoldRecord`, `CashOperation`, `ShiftHistoryRecord`, `StocktakeRecord`, and `ImportRecord`. Field-level meanings and rules are documented in their owning feature modules.

## Business Rules

| Status | Rule |
| --- | --- |
| Confirmed | Append actions prepend records; status updates map by ID. |
| Confirmed | The store itself performs no validation beyond TypeScript types; owning screens/commands validate. |
| Confirmed | Seed data is isolated in `model/seed.ts`, not embedded in rendering code. |
| Inferred | Operational history is intended to be append-only, but Local Storage can be reset/edited. |
| Open question | Future records must be split into authoritative domain services/read models. |

## States and Transitions

Operations does not define a unified state machine. Transfer, hold, stocktake, import, PO, return, and shift states belong to their owner documents. This avoids pretending unrelated statuses share one lifecycle.

## User Flows

Owning modules validate and then call one Operations action. Errors are currently handled before the store; actions do not return structured failures except status updates through caller logic.

## Current Data Handling

All arrays persist together under `dinopos-v6-operations`; initial values come from `seed.ts`. This broad persisted shape is preserved for compatibility. No Local Storage key or record shape changed during restructuring.

## Future Frontend/Backend Contracts

There should be **no** generic `/operations` backend endpoint. Each owner uses its domain contract (`/returns`, `/holds`, `/inventory/transfers`, `/shifts`, `/purchase-orders`, `/catalog-imports`). Shared audit queries may expose a read-only activity stream.

```json
{
  "data": [{
    "id": "evt_01J...",
    "domain": "inventory",
    "type": "transfer.sent",
    "entityId": "TR-208",
    "actor": { "id": "e1", "name": "Liam Johnson" },
    "occurredAt": "2026-09-20T08:15:00Z"
  }],
  "meta": { "requestId": "req_01J...", "page": { "nextCursor": null, "limit": 50 } }
}
```

`GET /api/v1/activity` would require `audit:read`, accept domain/store/date filters, be retryable as a query, and never permit mutation.

## Dependencies

Depends only on shared persistence/config. Many workflow modules depend on it. Future domain APIs will remove this central client repository gradually while compatibility selectors may compose remote results.

## Open Questions

Domain service ownership, audit retention, migration of the combined persisted shape, and which activity is legally immutable require decisions.

