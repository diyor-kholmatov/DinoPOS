# DinoPOS Design Research

This document records the design-system research required by the migration
specification. Sources were reviewed on 2026-08-18. They inform behavior and
information architecture; DinoPOS keeps its own Option A visual identity.

## Shopify POS

Source: <https://shopify.dev/docs/api/pos-ui-extensions/2025-10/web-components>

### What was studied

The POS component model separates quick touch actions, feedback/status,
transaction forms, layout primitives, standardized icons, and POS-specific
tiles. Its central lesson is operational priority: retail actions should be
short, touch-safe, and explicit about state and outcome.

### DinoPOS decisions

- Checkout follows search/scan, add, review, payment, confirmation in that order.
- `ProductTile` is a large press target with product name and price primary;
  stock and type are secondary.
- `RegisterStatusBar` stays compact in normal operation and expands only for a
  blocked sale with a reason and recovery action.
- Warnings appear in transaction context. Fiscalization warnings sit beside Pay.
- Payment completion uses a focused confirmation dialog and receipt summary.
- Quick actions are limited to common cashier tasks and never compete with Pay.

### Components informed

`CheckoutPage`, `ProductTile`, `CartLine`, `PaymentMethod`,
`RegisterStatusBar`, `InlineNotice`, `PaymentSuccessDialog`.

### Patterns not adopted

Shopify's extension-target model and visual identity are platform-specific.
DinoPOS will not copy Polaris styling, smart-grid composition, or app-extension
constraints. Touch priority and transaction feedback are adapted to warm neutral
Option A surfaces with lime reserved for the primary action.

## IBM Carbon

Sources:

- <https://carbondesignsystem.com/components/overview/components/>
- <https://carbondesignsystem.com/components/data-table/accessibility/>

### What was studied

Carbon treats a component as a reusable solution to a specific interface
problem and emphasizes keyboard-complete data tables. Sortable headers are in
the tab order, activate with Space or Enter, expose `aria-sort`, and retain a
visible sorted state. Interactive cell controls keep normal keyboard behavior;
pagination is a separate control.

### DinoPOS decisions

- One TanStack-powered `DataTable` serves operational and CRM modules.
- Tables receive accessible names and native table semantics by default.
- Sorting is exposed on hover and focus and remains visible while active.
- Bulk actions appear only after row selection.
- Pagination, density, column visibility, and filters are composable toolbar
  controls, not one page-specific table implementation.
- Loading, empty, error, and filtered-zero states are distinct.

### Components informed

`DataTable`, `TableToolbar`, `SortableHeader`, `RowActions`, `Pagination`,
`FilterChip`, `BulkActionBar`, administrative forms and notices.

### Patterns not adopted

Carbon's blue brand palette, 16-column product grid, and characteristic square
visual language are not used. The accessibility contract and structural rigor
are retained while surfaces, radii, spacing, focus, and status colors come from
Option A tokens.

## Atlassian Design System

Sources:

- <https://atlassian.design/components>
- <https://atlassian.design/components/dynamic-table>

### What was studied

Atlassian separates primitives, navigation, overlays, messaging, loading, and
data display. Its Dynamic Table combines sorting, pagination, and reordering.
The broader library demonstrates compact hierarchy through page headers,
toolbars, inline messages, popups, and restrained empty states.

### DinoPOS decisions

- Page headers remain compact and may contain search, filters, or one primary
  action without becoming hero sections.
- Toolbars attach visually to their table or collection.
- Inline messages describe recoverable local problems; dialogs are reserved for
  consequential decisions.
- Tooltips are non-interactive labels only. Actions belong in menus or popovers.
- Dense screens use a 4 px spacing grid, 40–44 px compact rows, and clear
  typography rather than oversized cards.

### Components informed

`PageHeader`, `TableToolbar`, `EmptyState`, `InlineNotice`, `DropdownMenu`,
`ProfilePopover`, `NavigationRail`, `MobileNavigationDrawer`.

### Patterns not adopted

Atlassian-specific navigation, blue accent, Jira object icons, and deprecated
page/side-navigation patterns are excluded. DinoPOS uses React Router, Lucide,
and its own compact Rail.

## WAI-ARIA Authoring Practices

Source: <https://www.w3.org/WAI/ARIA/apg/patterns/>

### What was studied

The APG distinguishes static tables from interactive grids and defines keyboard
and semantic expectations for dialogs, tooltips, menu buttons, listboxes,
comboboxes, tabs, toolbars, switches, and disclosure widgets. A tooltip must
also appear on keyboard focus; a modal must manage focus; interactive grids use
directional navigation rather than a long uncontrolled tab sequence.

### DinoPOS decisions

- Prefer native elements and React Aria behavior before adding ARIA manually.
- Every icon-only button has an accessible name and a focus-triggered Tooltip.
- Dialog focus is trapped, Escape closes when safe, and focus returns to the
  trigger.
- Mobile navigation closes on Escape, overlay press, or route selection and
  returns focus to the Menu button.
- Tabs expose tab/tablist/tabpanel relationships and keyboard movement.
- Table semantics remain native unless a true interactive grid is required.
- Status always includes text or an icon in addition to color.

### Components informed

All shared controls, especially `NavigationTooltip`, `Dialog`, `Drawer`,
`ComboBox`, `DateRangePicker`, `DataTable`, `Tabs`, and `Switch`.

### Patterns not adopted

The APG examples are reference implementations, not a visual component system.
We will not copy their styling or add ARIA roles where native HTML or React Aria
already provides correct semantics.

## Supporting Implementation Research

React Aria's DateRangePicker composes two DateFields and a RangeCalendar,
localizes date formats automatically, and exposes validation and unavailable
date behavior. DinoPOS will style that behavior with tokens rather than keep the
legacy custom calendar.

TanStack Table remains a headless engine. DinoPOS owns semantic markup and visual
states while using the engine for sorting, filtering, selection, pagination,
visibility, ordering, and saved table state.

## Source to Component to Application Matrix

| Source | Principle | DinoPOS component | Application area |
| --- | --- | --- | --- |
| Shopify POS | touch-first operation priority | `ProductTile`, `PaymentMethod` | Checkout |
| Shopify POS | contextual transaction feedback | `RegisterStatusBar`, `InlineNotice` | Checkout, Shift |
| Carbon | keyboard sortable named tables | `DataTable`, `SortableHeader` | Catalog, CRM, operations |
| Carbon | separate pagination and controls | `TableToolbar`, `Pagination` | All data tables |
| Atlassian | compact hierarchy and density | `PageHeader`, attached toolbars | Back office modules |
| Atlassian | non-interactive tooltips | `NavigationTooltip` | Navigation and icon actions |
| WAI-ARIA APG | focus and keyboard contracts | shared overlays and controls | Entire application |
| React Aria | localized complex input behavior | `DateRangePicker`, `Select`, `ComboBox` | Dashboard, forms, filters |

## Option A Adaptation Rules

- Lime `#A6E000` is used for the primary action, focus/active selection, and a
  very small number of brand details. It is not a status color.
- Green, amber, and red communicate positive, warning, and danger semantics only.
- Data colors are confined to charts and categorical data visualization.
- Warm neutral surfaces carry hierarchy; borders and spacing do more work than
  shadows.
- No source system's brand color, icon family, or default theme is imported.

