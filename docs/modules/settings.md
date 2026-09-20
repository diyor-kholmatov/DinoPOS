# Settings Module

## Purpose

Settings configures company profile, device/session toggles, payment availability, receipt preferences, taxes/fees/rounding, language, permission flags, and employees. It does not currently enforce production authorization or drive every Checkout calculation.

## Related Screens

- `/settings`: grouped forms and operational status.
- Public/model entries: `modules/settings/index.ts`, `modules/settings/model/index.ts`.

## Functionality

Edit/save company; toggle theme/fiscalization/online/register mode; enable payment methods; configure receipt fields/message; edit tax/service fee/rounding; switch language; toggle permission flags; add employee; show system status and mode restriction feedback. Form validation and persisted control states are implemented.

## Entities and Fields

| Entity | Fields | Rules/display |
| --- | --- | --- |
| Company profile | business name/type/phone/address | text form |
| Payment settings | cash/card/QR/transfer booleans | toggles |
| Receipt settings | logo/customer/tax booleans, message | toggles/text |
| Tax settings | taxRate, serviceFee, rounding | 0–100, rounding none/nearest100 |
| Permissions | string-to-boolean flags | discounts, returns, cash operations, stock adjustments |
| Session settings | theme/fiscal/online/mode/locale/employees | owned by Session |

## Business Rules

| Status | Rule |
| --- | --- |
| Confirmed | Tax rate and service fee UI validate 0–100. |
| Confirmed | Register mode cannot change during an open shift. |
| Confirmed | Locale and explicit theme apply immediately and persist. |
| Confirmed | Settings persist under a stable v6 key; Session-owned values persist separately. |
| Conflict | Checkout currently uses fixed 12% fiscal tax and exposes all tender methods regardless of Settings toggles. |
| Conflict | Permission toggles are stored but not used to authorize actions. |
| Inferred | Online/fiscal toggles simulate device/integration state for the prototype. |
| Open question | Tenant vs store vs device scope and save/audit semantics. |

## States and Transitions

Forms move between persisted value, edited local value, validation error, and saved value. Toggles mostly persist immediately. Register mode has a guarded transition that returns false while shift open.

## User Flows

Owner opens Settings, edits a group, validation runs, and save/toggle writes local state. Language/theme update the active app immediately. Mode change can fail with open-shift feedback. Adding employee appends a Session employee.

## Current Data Handling

Company/payment/receipt/tax/permission values persist in `dinopos-v6-settings`; locale/theme/device/register/employees persist in Session. Defaults are hardcoded. There is no remote company, role, payment, fiscal, printer, or health-check service.

## Future Frontend/Backend Contracts

### Update settings group

| Item | Proposal |
| --- | --- |
| Method/endpoint | `PATCH /api/v1/settings/{group}` |
| Consumer | Settings group form |
| Validation/errors | group schema, scope, version; `403`, `409 VERSION_CONFLICT/SHIFT_OPEN`, `422` fields |
| Permission/effects | group-specific `settings:*`; audited configuration update |
| Idempotency/loading/retry | versioned patch; disable save; no automatic retry after conflict; low-risk preference may be optimistic |

```json
{
  "version": 4,
  "taxRatePercent": 12,
  "serviceFeePercent": 0,
  "rounding": "none"
}
```

```json
{
  "data": { "group": "taxes", "version": 5, "taxRatePercent": 12, "serviceFeePercent": 0, "rounding": "none" },
  "meta": { "requestId": "req_01J..." }
}
```

Reads may use `GET /settings`; employee/role management should use dedicated identity contracts rather than generic settings patches.

## Dependencies

Uses Settings store, Session state/actions, shared forms/toggles, and i18n. Checkout/Register should eventually consume authoritative configuration and permissions. Future APIs split tenant, store, device, payment, receipt, tax, and identity scopes.

## Open Questions

Scope/inheritance, role enforcement, tax applicability, tender-provider configuration, fiscal/printer health, employee invitations, audit/versioning, and dangerous-data actions require product/backend decisions.
