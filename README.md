# DinoPOS

DinoPOS is a React and TypeScript point-of-sale workspace for retail and service businesses.

## Current release

- Dashboard and reports with shared store/date filters and ECharts analytics
- Production checkout with product search, barcode entry, cart, payments, and receipts
- Catalog, import, inventory, stocktake, and inter-store transfers
- Customers, sales, suppliers, purchase orders, returns, drafts, and held sales
- Shift opening/closing, cash operations, immutable register history, and settings
- Cash, card, QR, transfer, debt, prepayment, fiscal, and non-fiscal workflows
- Typed Zustand persistence plus legacy Local Storage backup and migration
- Responsive desktop, tablet, and mobile layouts
- English, Russian, and Uzbek interfaces
- Option A light and dark design tokens
- Component documentation in Storybook and automated Vitest, Playwright, and axe checks

## Local development

```bash
pnpm install
pnpm dev
```

## Verification

```bash
pnpm check
pnpm test:e2e
pnpm build-storybook
```

The v6 compatibility layer reads `retailos-unified-brief-v5-i18n`, stores an untouched backup in `dinopos-v5-backup`, and migrates supported records into typed Zustand stores.

The GitHub Pages build supports direct React routes and redirects legacy links such as `dashboard.html` and `checkout.html`.
