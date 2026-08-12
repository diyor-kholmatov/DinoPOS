# RetailOS Unified Prototype

This direct-open HTML/CSS/JavaScript application combines the original
RetailOS visual foundation with the Inventory and Cash Register specifications.

Open `index.html` for the dashboard or `checkout.html` for the POS.

## Modules

- Dashboard, Checkout, Sales, Catalog, Import, Suppliers
- Inventory and Stocktake, Branch Transfer
- Clients, Reports, Configuration
- Sale Drafts, Returns and Exchanges, Holds and Deposits
- Cash Shift, Cash Operations, Register History

## Product rules represented

- Atomic entitlement keys gate shift, cash, fiscal, close-count, and history features.
- Basic mode creates a clearly marked non-fiscal sales slip.
- Full mode requires an open shift before payment, returns, or cash movement.
- Drafts are local-first and never reserve stock.
- Held goods reduce available-to-sell but remain in physical on-hand stock.
- Money and stock changes write shared attributed movement records.
- Customer deposit balance is derived from signed transactions.
- Canonical operational values are independent from their translated display labels.
- UZS amounts and dates use the active locale's formatting rules.

Prototype data is stored in browser local storage under
`retailos-unified-brief-v5-i18n`.

## Localization

The full interface is available in English, Russian, and Uzbek. Translation
files live in `js/locales/` and use stable, namespaced message keys such as
`inventory.lowStock`, `checkout.paymentSuccess`, and `status.completed`.

To add another language:

1. Copy `js/locales/en.js` and keep the same message keys.
2. Translate values without changing placeholders such as `{amount}` or `{count}`.
3. Load the new locale file before `js/app.js`.
4. Add the locale code to `BROWSER_LOCALES` and both language selectors.
5. Run `node tests/i18n.cjs` and `node tests/smoke.cjs`.

`window.NOVA_LOCALES.__source` is a compatibility layer for legacy prototype
copy. New features should call `tr("namespace.message")` and store status codes
or domain values separately from translated labels.
