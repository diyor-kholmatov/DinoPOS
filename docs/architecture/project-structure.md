# Project Structure

## Current tree

```text
apps/web/
  index.html
  src/
    app/
      layouts/          shell and route error boundary
      navigation/       desktop/mobile navigation and profile controls
      providers/        i18n, tooltip, toast, theme setup
      router/           lazy route declarations
    pages/              one thin composition file per route
    modules/
      <module>/
        components/     module-only UI when needed
        constants/      static module data when needed
        model/          entities, stores, calculations, commands
        screens/        route-level module UI
        index.ts        public screen API
    shared/
      config/           environment and storage constants
      data/             reusable table/chart composition
      hooks/            product-independent hooks
      legacy/           isolated v5 migration compatibility
      lib/              formatting and class utilities
      patterns/         page/workspace/feedback patterns
      persistence/      browser storage adapter
      ui/               reusable controls
    i18n/               setup and locale catalogs
    styles/             global and generated token CSS
    stories/            component examples
    tests/              test environment setup
e2e/                    Playwright route and workflow tests
scripts/                tokens, boundaries, Pages finalization
docs/                   current documentation and archive
```

Folders are created only when a module needs them. Small modules are not forced into empty `hooks`, `services`, or `utils` layers.

## Ownership

| Layer | Owns | Must not own |
| --- | --- | --- |
| `app` | startup, shell, navigation, providers, router | product calculations |
| `pages` | route-to-screen composition | state, validation, business rules |
| `modules` | product entities, state, commands, screens | global visual primitives |
| `shared` | reusable UI and infrastructure | product-specific state |
| `i18n` | runtime initialization and translations | product behavior |

## Enforcement

`scripts/check-boundaries.mjs` verifies dependency direction, cross-module entry-point use, direct Local Storage access, and runtime module cycles. TypeScript aliases resolve `@/*` to `apps/web/src/*`.
