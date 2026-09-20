# Session, Stores, and Employees Module

## Purpose

Session owns cross-application context: stores, selected store, employees, current register, register mode, entitlements, fiscal/online state, pending fiscal count, locale, explicit theme, navigation preferences, and mobile navigation state. It is not production authentication or authorization.

## Related Screens

No dedicated route. Used by the application shell/navigation/profile and nearly every operational screen. Settings edits session/device values; Register owns shift UI. Model entry: `modules/session/model/index.ts`.

## Functionality

Select store when shift is closed; open/close shift; adjust expected cash; record payment/fiscal queue; toggle fiscalization/online/mode/theme/navigation; change locale; add employee; pin/reorder/reset navigation; manage mobile drawer; expose current cashier and fiscalization helpers.

## Entities and Fields

| Entity | Fields | Rules/display |
| --- | --- | --- |
| `Store` | ID, name | selected scope and register ownership |
| `Employee` | ID, name, role, active | active employees can open shifts |
| `Register` | store/open/shift/cashier/cash amounts/time | current device register |
| Session preferences | locale/theme/navigation paths | user/device presentation |
| Device state | mode, fiscalization, online, pending count | operational readiness |

## Business Rules

| Status | Rule |
| --- | --- |
| Confirmed | Selected store must exist and cannot change during an open shift. |
| Confirmed | Register mode cannot change during an open shift. |
| Confirmed | Theme changes only through explicit user action; light is initial approved default. |
| Confirmed | Locale is EN/RU/UZ and applies/persists immediately. |
| Confirmed | Cash payment increases expected cash; queued fiscal count increases only when fiscalization is required while offline. |
| Confirmed | Navigation preferences normalize allowed paths and persist. |
| Inferred | `entitlements` approximates plan/feature availability, not user permissions. |
| Conflict | Employees/roles are local strings and settings permissions are disconnected from enforcement. |
| Open question | Authentication, tenancy, roles, store access, device registration, and preference scope. |

## States and Transitions

Register lifecycle is documented under Register. Online/fiscal/theme/locale/navigation are independent preference states. Store selection is blocked only while register is open.

## User Flows

**Change store:** user chooses valid store, command rejects if shift open, otherwise updates selected store and register store. **Change language/theme:** user acts in profile/settings; persisted state updates and provider/document reflects it. **Customize navigation:** pin/reorder/reset paths; normalized preferences render on subsequent loads.

## Current Data Handling

Session persists in `dinopos-v6-session`, initialized from bootstrap/legacy data. Theme is applied to the document by provider/hook. No server identity, authorization, subscription, sync, or device service exists.

## Future Frontend/Backend Contracts

### Bootstrap current session

| Item | Proposal |
| --- | --- |
| Method/endpoint | `GET /api/v1/session` |
| Consumer | App providers/shell |
| Response | user, roles/permissions, stores, selected/default store, device/register status, entitlements, locale/preferences |
| Errors/status | `200`, `401`, `403 DEVICE_DISABLED`; retry transient failures, otherwise show blocking session state |
| Permission/effects | authenticated principal; read-only bootstrap |

```json
{
  "data": {
    "user": { "id": "e1", "name": "Liam Johnson", "roles": ["owner"] },
    "permissions": ["sales:create", "inventory:read", "settings:write"],
    "stores": [{ "id": "b1", "name": "Airport Kiosk" }],
    "selectedStoreId": "b1",
    "device": { "id": "dev_1", "registerId": "REG-01", "mode": "full", "online": true },
    "preferences": { "locale": "en", "theme": "light" }
  },
  "meta": { "requestId": "req_01J..." }
}
```

Preference updates use versioned `PATCH /users/me/preferences`; store/device changes require permission and may return `409 SHIFT_OPEN`. Optimistic UI is acceptable for theme/navigation with rollback, not register/store transitions.

## Dependencies

Uses Sales payment type plus shared persistence/formatting/legacy bootstrap. App shell and product modules consume Session. Future identity/config/register APIs replace local context while UI preferences may retain local cache.

## Open Questions

Auth provider, tenant/store scope, role matrix, device enrollment, session expiry, employee lifecycle, entitlements source, preference sync, and offline identity are unresolved.

