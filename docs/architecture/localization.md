# Localization

DinoPOS uses i18next and React i18next. English (`en`), Russian (`ru`), and Uzbek (`uz`) catalogs live under `apps/web/src/i18n/locales`. Pilot catalogs are retained separately for compatibility/reference.

## Runtime rules

- The active locale is persisted by the Session store.
- `AppProviders` synchronizes the persisted locale with i18next.
- Dates, time, numbers, and UZS values use locale-aware `Intl` formatters in `shared/lib/format.ts`.
- Reusable controls read the i18next runtime language or receive labels as props; shared UI does not import Session.
- Translation keys, not translated strings, drive component behavior.
- English is the fallback language.

## Maintenance

Add matching keys to all three current catalogs in one change. Verify narrow layouts because Russian and Uzbek labels can be longer than English. Playwright covers language switching and persistence; route tests reject visible raw namespaced keys.
