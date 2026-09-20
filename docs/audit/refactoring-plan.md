# Frontend Restructuring Plan

Date: 2026-09-20

## Goals

- Preserve every route, user flow, calculation, visual state, localization key, and localStorage key.
- Put route composition, product modules, shared infrastructure, assets/styles, and localization under `apps/web/src`.
- Give each product module a public entry point.
- Stop shared UI from importing product stores.
- Centralize browser persistence keys/storage and runtime configuration.
- Keep the architecture proportional to a single frontend application.
- Create complete current-state, module, architecture, and proposed API-contract documentation.
- Create no backend code.

## Target structure

```text
apps/web/
  index.html
  src/
    app/                 bootstrap, router, providers, shell, navigation
    pages/               thin lazy-route composition
    modules/             product logic, screens, stores, types, module APIs
    shared/              UI, data display, patterns, formatting, persistence, legacy migration
    i18n/                translation catalogs and setup
    styles/              global/generated theme CSS
    stories/             Storybook examples
    tests/               test setup
docs/
  README.md
  architecture/
  modules/
  contracts/
  decisions/
  diagrams/
  audit/
  archive/
```

## Module boundaries

| Module | Owns | May depend on |
| --- | --- | --- |
| `session` | stores, employees, register/session/device state | shared, sales types, navigation preferences |
| `catalog` | product schema, product CRUD, stock/hold/movement model | shared, session types, sales line types |
| `checkout` | cart/draft state, totals, completion orchestration, checkout screen | catalog, customers, sales, session, shared |
| `customers` | customer schema, accounts and transactions, customer screen | sales payment type, session, shared |
| `sales` | sale schema/store, sales screen | session, shared |
| `analytics` | periods, ranges, granularity, aggregations, filter controls | catalog/sales types, session, shared |
| `dashboard` | Dashboard composition | analytics, catalog, session, shared |
| `inventory` | inventory and transfer screens | catalog, operations, session, shared |
| `operations` | persisted operational record store and types | shared |
| `suppliers` | supplier/PO screen | operations, session, shared |
| `returns` | return flow screen | operations, sales, catalog, customers, session, shared |
| `holds` | hold flow screen | operations, checkout, catalog, customers, session, shared |
| `register` | shift, cash operation, history screens | session, operations, shared |
| `reports` | report composition | analytics, sales, catalog, customers, operations, session, shared |
| `settings` | company/device configuration and settings screen | session, shared |

`drafts` and catalog import are route surfaces of Checkout and Catalog respectively, not independent state domains.

## File move strategy

1. Move `src/app` to `apps/web/src/app`.
2. Move shared UI/data/pattern components to `apps/web/src/shared`.
3. Move navigation to `apps/web/src/app/navigation` because it depends on session state and routing.
4. Move entity schemas and stores into owning modules.
5. Move feature implementation into module `screens`, `components`, or `model` folders.
6. Create one thin route file per URL in `apps/web/src/pages`.
7. Add `index.ts` as the public API for every module.
8. Move i18n, styles, stories, tests, main entry, and `vite-env.d.ts` under `apps/web/src`.
9. Move `index.html` to `apps/web/index.html` and configure Vite root/output.
10. Update TypeScript, Vite, Storybook, token generation, and tests to the new root.

Moves use `git mv`; history is not rewritten.

## Dependency rules

1. `shared` cannot import from `modules` or `pages`.
2. `modules` can import `shared` and another module only through that module's public `index.ts`.
3. `pages` import module screen exports and contain no business logic.
4. `app` imports pages, session public APIs, and shared infrastructure.
5. Module internals use relative imports or their own public API only where it does not create cycles.
6. Existing cross-domain transaction orchestration remains in Checkout, Returns, and Holds until a backend command boundary exists.

## Persistence and compatibility

- Introduce `shared/persistence/storage.ts` as the only direct browser-storage adapter.
- Introduce `shared/config/storage-keys.ts` for all current key strings.
- Do not rename keys or change persisted state shape.
- Keep legacy migration and backup behavior unchanged.
- Add persistence regression coverage for the centralized adapter and existing navigation/session hydration.

## Documentation deliverables

- Main index and root README.
- Eight architecture documents.
- Module documents for every actual module.
- API conventions and per-module proposed contracts with JSON examples.
- Mermaid module, dependency, data-source, frontend/backend boundary, flow, and state diagrams.
- Architecture decisions and open-question register.
- Historical documents moved to `docs/archive` without deletion.

## Verification gates

After structural moves:

1. `pnpm tokens`
2. TypeScript project build
3. Vitest
4. Vite production build and Pages finalization
5. Storybook static build
6. Playwright desktop/tablet/mobile suite
7. Route crawl for all 16 routes and redirects
8. English, Russian, and Uzbek switching/persistence
9. localStorage key/shape smoke checks
10. screenshots and visual comparison for Dashboard and Checkout

## Known risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Alias/path breakage after move | Change configuration first, then run typecheck after each move group |
| localStorage reset | Preserve exact keys and store versions; add constants only |
| lazy-route export mismatch | Keep current named page exports through thin route wrappers |
| shared/module cycle | Remove session-store imports from shared date/chart components |
| Storybook source discovery break | Update `.storybook/main.ts` and preview style import |
| GitHub Pages output moves | Keep root `dist` through Vite `outDir` and retain finalizer |
| stale E2E expectations | Update only to approved store-context Dashboard title; preserve behavioral assertions |
| historical docs presented as current | Archive with a clear archive index; link current docs from `docs/README.md` |

## Explicit non-goals

- No backend project, endpoints, database, migrations, ORM, authentication server, controllers, queues, or infrastructure.
- No redesign.
- No route renaming.
- No persistence-key migration.
- No framework replacement.
- No speculative abstraction without a current use.
