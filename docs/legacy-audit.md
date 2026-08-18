# DinoPOS Legacy Application Audit

## Scope and Baseline

The production prototype is a direct-open HTML application. Seventeen thin HTML
route files load three locale dictionaries and one monolithic `js/app.js` file.
The shared stylesheet is `css/style.css`, with canonical Option A aliases in
`css/system.css`.

The migration baseline was captured on 2026-08-18 before React work began:

- 744 translation keys match across English, Russian, and Uzbek.
- All 17 routes render in all three locales.
- All 51 desktop, tablet, and mobile route checks have zero page overflow.
- Checkout status, cart quantity, fiscal warning, calendar range, navigation
  tooltip, analytics, empty, error, disabled, focus, hover, loading, and success
  state tests pass.
- The legacy storage key is `retailos-unified-brief-v5-i18n`.

These tests remain the behavioral oracle until equivalent React tests pass.

## Route Inventory

| Legacy file | New route | Domain |
| --- | --- | --- |
| `dashboard.html` | `/dashboard` | analytics and alerts |
| `checkout.html` | `/checkout` | basket, customer, payment, receipt |
| `catalog.html` | `/catalog` | products and services |
| `inventory.html` | `/inventory` | stock and stocktakes |
| `clients.html` | `/customers` | customer balances and history |
| `reports.html` | `/reports` | reporting and cashier performance |
| `sales.html` | `/sales` | receipts and fiscal status |
| `suppliers.html` | `/suppliers` | suppliers and purchase orders |
| `returns.html` | `/returns` | returns and exchanges |
| `drafts.html` | `/drafts` | local sale drafts |
| `holds.html` | `/holds` | held goods and deposits |
| `shift.html` | `/shift` | shift open and close |
| `cash-operations.html` | `/cash-operations` | drawer movements |
| `register-history.html` | `/register-history` | immutable shift history |
| `configuration.html` | `/settings` | company and register settings |
| `import.html` | `/catalog/import` | product import |
| `transfer.html` | `/inventory/transfers` | branch transfers |

Every legacy file must remain as a small redirect so bookmarked links survive.

## Persisted State Contract

The existing storage object mixes durable domain records, session state, and UI
preferences. The React migration must read it without mutating it until schema
validation and migration succeed.

### Durable domain records

- stores (`branches`) and selected `branchId`;
- products with `stockByBranch`, price, cost, unit, fiscal code, and status;
- customers, customer transaction ledger, debt, and prepayment;
- sales and sale lines;
- suppliers and purchase orders;
- stock movements and stocktakes;
- transfers;
- drafts, holds, returns, cash operations, money movements, register history;
- entitlement bundles and organization/register overrides.

### Active operational state

- current cart, customer, receipt discount, and payment method;
- active register, responsible cashier, shift, opening float, and expected cash;
- fiscalization, online state, and pending fiscal queue;
- current draft and checkout mobile pane.

### UI preferences

- locale and theme;
- selected dashboard stores, period, grouping, and date range;
- navigation collapsed state;
- table columns and saved filters.

The React schema will use stable English enum codes internally. Legacy Russian
status strings are translated once by the migration adapter and are never used
as future persisted identifiers.

## Business Rules That Must Not Change

### Checkout and stock

1. A product can be added only when its available-to-sell quantity permits it.
2. Available-to-sell is physical branch stock minus quantity in active holds.
3. Services are not stock-decremented.
4. Completing a sale decrements stock in the selected branch and writes an
   attributed stock movement for every physical product line.
5. Receipt-level discount is applied after line discounts and before tax.
6. Fiscal tax is 12% only when the fiscalization entitlement and setting are on.
7. A sale cannot complete with an empty cart or a closed required shift.

### Payment and customer balance

- Cash increases expected drawer cash.
- Debt increases the customer's debt.
- Prepayment requires sufficient balance and decreases that balance.
- Card, QR, and transfer do not change drawer cash.
- Every completed sale increases customer lifetime spend and appends receipt
  history.

### Fiscal behavior

- Online fiscalized sales receive a fiscal identifier immediately.
- Offline fiscalized sales increment the pending fiscal queue.
- Basic mode may create a clearly marked non-fiscal receipt.
- The non-fiscal warning belongs beside the Pay action and is conditional.

### Drafts and holds

- An active draft follows cart changes and can be restored without reserving
  stock.
- Held goods remain in physical stock but reduce available-to-sell.
- Hold deposits are ledger transactions, not decorative customer labels.
- Redeeming or cancelling a hold must preserve stock and balance attribution.

### Shift and cash control

- Full mode requires an attributed open shift for sales and cash operations.
- Opening captures cashier, store, register, float, and timestamp.
- Drawer expectation is derived from opening float plus cash in minus cash out.
- Closing records expected, counted, and variance as immutable history.
- Cash operations always include direction, amount, reason, actor, register,
  shift, store, and timestamp.

## Current UX and Architecture Risks

- Domain logic, rendering, localization fallback, event routing, and persistence
  are coupled in a single file, making regression impact difficult to isolate.
- Translation relies partly on post-render phrase replacement; React must use
  explicit message keys instead.
- Status values and labels are mixed across languages.
- Hand-authored SVG strings are duplicated through a global icon map.
- Native selects, custom calendars, dialogs, tables, and tooltips carry bespoke
  keyboard behavior that should move to established accessible libraries.
- All state writes replace one large Local Storage object, increasing corruption
  and partial-migration risk.
- The checkout transaction is not expressed as a pure, testable domain command.

## Migration Guardrails

1. Parse legacy data with Zod and preserve a backup before writing version 6.
2. Extract pure checkout totals, stock availability, payment eligibility, and
   sale completion functions before connecting them to React.
3. Split stores by domain; never introduce one replacement mega-store.
4. Keep legacy files and the published `main` branch untouched during the pilot.
5. Run legacy tests and React tests together until full parity is reached.
6. Remove `js/app.js` and `css/style.css` only after every route is migrated and
   the Local Storage restore test passes.

