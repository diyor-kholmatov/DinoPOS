# Retail OS UI Foundation

Status: extracted from the approved light Dashboard. These foundations are the shared implementation layer for future module work. They do not require modules to copy the Dashboard composition.

## Source Tokens

Tokens live in `tokens/` and are compiled by `pnpm tokens` into `src/styles/generated/`.

- `primitive.json`: warm neutrals, Option A action/status/data colors, 4px spacing, radii, shadows, and motion.
- `semantic.json`: assigns action, semantic status, chart, focus, touch-target, and row roles.
- `component.json`: application shell, control, page, workspace, and analytics dimensions.
- `themes/light.json` and `themes/dark.json`: explicit application themes. Light remains the startup theme.

Do not add color literals, custom spacing, radii, or shadows to feature modules. Add a token only when an existing primitive or semantic role cannot express a repeated need.

## Shared Components

### Application shell

- `AppShell`: full-width, minimum-zero application workspace.
- `NavigationRail`: tokenized 176px expanded and 64px collapsed desktop navigation.
- `ApplicationHeader`: shared mobile header.
- `MobileNavigationDrawer`: mobile navigation built on the shared `Drawer` primitive.

### Actions and inputs

- `Button`: primary, secondary, quiet, danger, loading, disabled, and size variants.
- `IconButton`: accessible label plus the standard 300ms Tooltip.
- `Input`, `SearchField`, `NumberField`, `SelectField`, `DateRangeField`, and `SwitchField`.
- `Badge`: neutral, positive, warning, danger, and information states.

Lime is reserved for the primary action and focus treatment. Status colors are never decorative.

### Workspaces and feedback

- `PageLayout`: fluid page width and tokenized responsive padding.
- `PageContextHeader`: restrained page context with compact aligned actions.
- `WorkspaceSurface`: one complete bordered functional workspace; optional elevation is reserved for the primary workspace.
- `WorkspaceRegion`: consistent internal padding.
- `SummaryList`: flexible labels and non-wrapping, right-aligned tabular values.
- `FeedbackState`, `LoadingState`, `ErrorState`, and `EmptyState`.

### Data and overlays

- `TableToolbar`: shared search, filters, metadata, and action layout without an extra card.
- `DataTable`: sorting, pagination, density, loading, empty, and error behavior; accepts a toolbar inside the same complete surface.
- `TimeSeriesChart`, `HorizontalBarChart`, and `DonutChart`: Option A chart roles.
- `Dialog` and `DialogFooter` for focused tasks.
- `Drawer` for edge-mounted contextual or navigation work.
- `Tooltip` for compact labels and unfamiliar icon actions.

## Composition Rules

1. A border defines a complete functional workspace, not each child row or metric.
2. Use one subtle `--shadow-sm` only for the primary workspace when hierarchy needs it.
3. Page content remains fluid after the Sidebar. Maximum widths are allowed only for narrow forms and reading-oriented content.
4. Controls use the shared 36px, 40px, 44px, and 48px roles. Operational rows use 44px or 48px.
5. Monetary values, counts, percentages, and numeric columns use tabular numerals and right alignment.
6. Feature pages may have different structures, but they share tokens, component states, typography, and interaction behavior.

## Adoption Boundary

Part 2 only extracts and documents the shared layer. Checkout, Catalog, Inventory, Customers, Reports, More, and Settings retain their current markup and business behavior until their individual rollout stages.
