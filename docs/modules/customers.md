# Customers Module

## Purpose

Customers manages customer identity, loyalty label, spend history, debt, prepayment, and account transactions used by Checkout. It does not own sale details or production accounting.

## Related Screens

- `/customers`: list/search/balance filters, create dialog, profile dialog, prepayment action.
- Model entry: `modules/customers/model/index.ts`.

## Functionality

Search name/phone; filter all/debt/prepayment; sort/page; add customer; inspect profile/receipt history; add prepayment; display semantic debt/credit states; preserve empty and validation states. Checkout applies sale effects through the customer store.

## Entities and Fields

| Entity | Fields | Rules/display |
| --- | --- | --- |
| `Customer` | `id`, `name`, `phone`, `totalSpent`, `debt`, `prepayment`, `loyalty`, `receiptHistory` | name required; amounts nonnegative; receipts reference Sales |
| `CustomerTransaction` | `id`, `customerId`, `type`, `amount`, `receiptNumber`, `createdAt` | type `debt`, `prepayment_spend`, or `prepayment_add`; signed spend amount currently negative |

## Business Rules

| Status | Rule |
| --- | --- |
| Confirmed | UI requires name length >= 2, phone length >= 5, and loyalty value. |
| Confirmed | Added prepayment must be positive and customer must exist. |
| Confirmed | Every completed customer sale increments total spent and prepends receipt history. |
| Confirmed | Debt tender adds total to debt and a debt transaction. |
| Confirmed | Prepayment tender subtracts total from prepayment and records a spend transaction; Checkout first checks sufficient balance. |
| Inferred | Debt and prepayment are current balances, not accounting-ledger projections. |
| Open question | Debt repayment, credit limit, customer merge, deletion/privacy, and loyalty calculation are not implemented. |

## States and Transitions

Customer balance state is derived: neutral, debt (>0), prepayment (>0), or both. Transactions are appended and have no UI mutation state. No customer lifecycle status exists.

## User Flows

**Add prepayment:** operator opens customer profile, enters positive amount, customer store increments prepayment and appends `prepayment_add`. Invalid amounts are rejected. **Checkout use:** customer is selected, tender eligibility is validated, and successful sale updates account and receipt history.

## Current Data Handling

Customers and transactions persist in `dinopos-v6-customers`, seeded/migrated locally. Totals and balances are mutated/calculated in the browser. Phone uniqueness is not enforced. There is no external CRM, consent, loyalty, or accounting integration.

## Future Frontend/Backend Contracts

### Add prepayment ledger entry

| Item | Proposal |
| --- | --- |
| Method/endpoint | `POST /api/v1/customers/{id}/ledger-entries` |
| Consumer | Customer profile |
| Validation/errors | positive amount, active customer, supported type; `404`, `409 VERSION_CONFLICT`, `422 INVALID_AMOUNT` |
| Permission/effects | `customers:manage-balance`; append immutable entry and update balance atomically |
| Idempotency/loading/retry | required; no optimistic balance; retry with same key |

```json
{ "type": "prepayment_add", "amount": 300000, "currency": "UZS", "note": "Counter deposit" }
```

```json
{
  "data": {
    "entryId": "cled_01J...",
    "customerId": "c1",
    "prepaymentBalance": 680000,
    "debtBalance": 0,
    "version": 8
  },
  "meta": { "requestId": "req_01J..." }
}
```

Queries: `GET /customers` and `GET /customers/{id}?include=ledger,receipts`; creation: `POST /customers`; edits use versioned `PATCH`. Sale-generated ledger entries belong to the atomic sale command.

## Dependencies

Uses Sales payment-method type and Session locale in the screen. Checkout, Reports, Returns, and Holds consume customer identity/balances. Future Customer APIs replace direct local mutations; Sales references remain IDs/links.

## Open Questions

Identity uniqueness, credit approval/limits, debt collection, loyalty levels, consent, deletion/anonymization, deposit refunds, and multi-currency balances require decisions.

