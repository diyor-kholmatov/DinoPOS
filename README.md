# DinoPOS

DinoPOS is a React and TypeScript point-of-sale workspace for retail and service businesses.

## Current release

- Production Checkout with product search and barcode entry
- Open-shift validation and compact register status
- Cash, card, QR, transfer, debt, and prepayment workflows
- Stock, customer balance, register cash, fiscal queue, receipt, and draft persistence
- Responsive desktop, tablet, and mobile layouts
- English, Russian, and Uzbek interfaces
- Option A light and dark design tokens

The remaining modules are being migrated incrementally and currently show a clear pending state.

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
