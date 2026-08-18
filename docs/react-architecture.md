# DinoPOS React Architecture Proposal

## Delivery Strategy

The migration is incremental and route-gated. The published legacy application
remains intact while the React shell and Checkout pilot are reviewed. Legacy
routes are removed only after full parity.

## Project Structure

```text
src/
  app/
    layouts/
    providers/
    router/
  components/
    data-display/
    feedback/
    navigation/
    patterns/
    ui/
  entities/
    customer/
    product/
    register/
    sale/
    shift/
    store/
  features/
    checkout/
    dashboard/
    catalog/
    inventory/
    customers/
    reports/
    sales/
    settings/
    shifts/
  hooks/
  i18n/
  lib/
  stores/
  styles/
  tests/
  tokens/
```

Route modules are lazy-loaded. `AppShell` owns navigation and the workspace;
features own page composition; entities own schemas and pure domain behavior.

## State Boundaries

| Store | Owns | Does not own |
| --- | --- | --- |
| `sessionStore` | current user, store, register, shift | products or sales |
| `checkoutStore` | cart, customer, discount, payment, active draft | product master data |
| `catalogStore` | product collection and catalog filters | checkout UI state |
| `customerStore` | customers and transaction ledger | translated labels |
| `operationsStore` | movements, holds, returns, transfers | component state |
| `preferencesStore` | locale, theme, Rail, density, saved views | domain records |

Cross-domain writes are executed by typed commands such as `completeSale`, not
by components reaching into multiple stores independently.

## Persistence and Migration

1. Read `retailos-unified-brief-v5-i18n` without modification.
2. Validate with a permissive legacy Zod schema.
3. Normalize missing fields and translate legacy status values to stable codes.
4. Write `dinopos-v6` only after the complete result passes the new schema.
5. Store `dinopos-v5-backup` once before first migration.
6. Fall back to the untouched legacy data if migration fails and show a
   recoverable error.

The migration is idempotent and covered by fixture tests for old, partial,
corrupt, and already-migrated data.

## Routing and GitHub Pages

- Vite base is `/DinoPOS/` in production and `/` in development.
- React Router uses a browser router in development and a GitHub Pages rewrite
  strategy in production.
- `404.html` restores the requested path through a query redirect before the
  router starts.
- Legacy HTML routes redirect to their corresponding React routes while
  preserving query and hash values.
- `/` redirects to `/dashboard`.

## Design-System Layers

1. Style Dictionary compiles primitive, semantic, component, light, and dark
   token JSON to CSS custom properties.
2. Tailwind maps utilities to those semantic variables.
3. shadcn/ui supplies general component structure and local source ownership.
4. React Aria supplies complex keyboard and localization behavior.
5. Product patterns compose primitives without inventing new visual rules.
6. Storybook documents foundations, composition, and every operational state.

## Checkout Pilot Boundaries

The pilot migrates the complete checkout workflow, not a visual shell:

- register readiness and open-shift recovery;
- store/register/customer selection;
- product search, category filter, scanner path, and stock availability;
- cart line quantity/removal and receipt discount;
- payment eligibility and selection;
- fiscal/non-fiscal/offline behavior;
- sale completion, stock/customer/cash side effects, receipt confirmation;
- keyboard operation, mobile catalog/cart switching, and persisted restore.

Non-checkout navigation routes display an explicit migration placeholder in the
pilot branch and link back to the still-available legacy page. They are not
silently reimplemented with incomplete logic.

## Test Pyramid

- Vitest: totals, stock availability, entitlements, migration, money formatting,
  sale completion, and stores.
- React Testing Library plus axe: shared controls, Navigation Rail,
  RegisterStatusBar, ProductTile, CartLine, payment states, dialogs.
- Playwright: startup, locale/store switch, open shift, add/change product,
  customer, discount, payment, completion, Local Storage restore, keyboard and
  mobile navigation.
- Legacy browser tests continue running until the last route is migrated.

## Approval Gate

The remaining modules do not move to React until the Checkout pilot, token
system, Storybook, Navigation Rail, persistence migration, and test evidence are
reviewed and approved.

