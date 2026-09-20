# DinoPOS

DinoPOS is a client-side React and TypeScript point-of-sale workspace for retail and service businesses. The current release includes checkout, catalog, inventory, customers, sales, returns, suppliers, register operations, reports, settings, responsive navigation, and English/Russian/Uzbek localization.

This repository contains **frontend code only**. Proposed backend endpoints are documented contracts, not implemented services.

## Repository layout

```text
apps/web/
  index.html
  src/
    app/          application shell, providers, router, navigation
    pages/        thin route composition
    modules/      product modules and business logic
    shared/       reusable UI and infrastructure
    i18n/         EN, RU, and UZ catalogs
    styles/       Retail OS tokens and global CSS
    stories/      Storybook examples
docs/
  architecture/  current frontend architecture and data flow
  modules/       implemented behavior and proposed API contracts
  contracts/     shared future-API conventions
  decisions/     architecture decision records
  audit/         pre-refactor inventory and migration plan
  archive/       retained historical specifications
```

See the [documentation index](docs/README.md) for the complete map.

## Requirements

- Node.js 20 or newer
- pnpm 11

## Development

```bash
pnpm install
pnpm dev
```

Vite serves the app from `apps/web`. Routes are lazy-loaded, while all production output remains in the root `dist/` directory.

## Verification

```bash
pnpm check
pnpm test:e2e
pnpm build-storybook
```

`pnpm check` generates design tokens, validates dependency boundaries and runtime module cycles, type-checks, runs Vitest, builds the production app, and prepares GitHub Pages fallbacks.

## Persistence and compatibility

The current prototype uses versioned Zustand stores backed by browser Local Storage. Storage keys and access are centralized in `apps/web/src/shared/config/storage-keys.ts` and `apps/web/src/shared/persistence/storage.ts`.

The v6 compatibility layer reads `retailos-unified-brief-v5-i18n`, stores an untouched backup in `dinopos-v5-backup`, and migrates supported records into the current stores. These keys and persisted shapes are compatibility contracts.

## Deployment

The GitHub Pages workflow builds with the `/DinoPOS/` base path and publishes `dist/`. The finalizer supports direct React routes and legacy links such as `dashboard.html` and `checkout.html`.

## Architecture rules

- `shared` does not depend on product modules.
- Route files compose module screens and contain no business logic.
- Cross-module runtime imports use public module or model entry points.
- Direct browser storage access is restricted to the shared persistence adapter.
- Product behavior, routes, localization, calculations, and the approved visual system must be preserved during structural changes.
- No backend, database, ORM, server authentication, queue, or API implementation belongs in this repository task.
