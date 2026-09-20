# State Management

## Runtime model

Zustand stores hold persistent product state. Component-local React state owns temporary UI concerns such as open dialogs, form drafts, table filters, and selected receipt details. Pure functions calculate totals, availability, analytics, and formatting.

| Store key | Module | Important persisted state |
| --- | --- | --- |
| `dinopos-v6-session` | Session | store, register, employees, locale, theme, navigation, fiscal/online state |
| `dinopos-v6-catalog` | Catalog | products, held quantities, stock movements |
| `dinopos-v6-checkout` | Checkout | cart, customer, discount, payment method, drafts |
| `dinopos-v6-customers` | Customers | customer accounts and transactions |
| `dinopos-v6-sales` | Sales | completed sales |
| `dinopos-v6-operations` | Operations | suppliers, purchase orders, transfers, returns, holds, shifts, stocktakes, imports |
| `dinopos-v6-settings` | Settings | company, payments, receipt, tax, rounding, permissions |

## Rules

- Storage keys and versions remain unchanged for compatibility.
- Only `shared/persistence/storage.ts` directly references browser storage.
- Store actions enforce domain constraints before mutation.
- Checkout's critical multi-store command validates all preconditions before applying mutations.
- Persisted Checkout state is intentionally partial; transient search/category/mobile view are not restored.
- Session theme changes only through an explicit application action; OS color preference does not overwrite it.

## Future migration

Replace store persistence incrementally with query/command adapters. Keep transient UI state local. Server responses should become the source of truth for sales, stock, balances, shifts, and permissions; optimistic updates are appropriate only for reversible low-risk settings.
