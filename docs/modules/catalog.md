# Catalog Module

## Purpose

Catalog manages products and services that can be sold. It owns product validation, product CRUD state, per-store stock representation, held quantities, stock movements, and import presentation. It does not own checkout, supplier purchasing, or remote file parsing.

## Related Screens

- `/catalog`: list, filters, create/edit dialog.
- `/catalog/import`: file selection, validation preview, barcode lookup, import history.
- Public/model entries: `modules/catalog/index.ts`, `modules/catalog/model/index.ts`.

## Functionality

Search name/SKU/barcode/supplier; filter item type/category; sort/page; create/edit; detect duplicate barcode; open import; preview mock import rows; finish an import record; scan a product; expose availability and stock commands to other modules. Empty results, validation, loading-like import progress, success, and error feedback are present.

## Entities and Fields

| Entity | Fields | Rules/display |
| --- | --- | --- |
| `Product` | `id`, `name`, `sku`, `barcode`, `category`, `supplier`, `price`, `cost`, `stockByStore`, `unit`, `favorite`, `active` | `unit` is `pcs` or `service`; monetary/stock values nonnegative; stock is per store |
| `StockMovement` | `id`, product identity, `storeId`, `type`, `quantity`, `actor`, `createdAt` | types: sale, adjustment, transfer out/in, return; signed quantity shown in history |
| `ImportRecord` | `id`, `fileName`, `rows`, `validRows`, `status`, `createdAt` | status `checking` or `finished`; Operations persists history |

## Business Rules

| Status | Rule |
| --- | --- |
| Confirmed | Product IDs/names are required; price/cost/stock cannot be negative. |
| Confirmed | UI requires name, SKU, category, supplier, positive price, nonnegative cost/stock, and barcode length >= 3. |
| Confirmed | Barcode must be unique among products. |
| Confirmed | Services have no finite stock and skip stock mutations. |
| Confirmed | Available stock equals physical stock minus held quantity, clamped to zero. |
| Confirmed | Stock adjustment cannot produce negative physical stock. |
| Confirmed | Sale movements decrement product stock; return/transfer/adjustment commands append movement records. |
| Conflict | The import screen reports valid rows as imported, but does not parse the selected file or create catalog products. |
| Open question | SKU uniqueness, soft deletion, price history, variants, units, taxes, and multi-currency are undefined. |

## States and Transitions

Products are active/inactive and product/service. Import records move `checking -> finished`; there is no failed persisted state. Stock availability is derived, not a stored status.

## User Flows

**Create/edit product:** manager opens dialog, enters validated fields, duplicate barcode is checked, and store state is inserted/updated. Errors remain in the dialog; success updates the table.

**Import:** user selects an accepted filename, sees three demonstration rows, and confirms. An import-history record is saved. Actual file parsing/catalog mutation is not implemented.

## Current Data Handling

Products and stock movements persist in `dinopos-v6-catalog`. Initial data comes from bootstrap/seed migration. Held quantities are persisted in the same store. Import preview rows are isolated in `modules/catalog/constants/import-preview.ts`; import history lives in Operations. Search, sorting, validation, availability, and stock calculations run in the browser.

## Future Frontend/Backend Contracts

### Create product

| Item | Proposal |
| --- | --- |
| Method/endpoint | `POST /api/v1/products` |
| Consumer | Catalog form |
| Validation/errors | required fields, unique barcode/SKU, nonnegative amounts; `409 BARCODE_EXISTS`; `422` fields |
| Permission/effects | `catalog:write`; create sellable and optional opening stock ledger |
| Idempotency/loading/retry | key required when opening stock is included; disable submit; retry same key only |

```json
{
  "name": "White Sneakers",
  "sku": "SH-WHT-42",
  "barcode": "4780012345678",
  "category": "Footwear",
  "supplierId": "s2",
  "unit": "pcs",
  "price": 790000,
  "cost": 460000,
  "active": true,
  "openingStock": [{ "storeId": "b1", "quantity": 14 }]
}
```

```json
{
  "data": {
    "id": "prod_01J...",
    "name": "White Sneakers",
    "version": 1,
    "stockByStore": { "b1": 14 }
  },
  "meta": { "requestId": "req_01J..." }
}
```

Queries: `GET /api/v1/products?storeId=&search=&unit=&category=&active=&sort=&page[...]`; update: `PATCH /api/v1/products/{id}` with version. Import should be `POST /api/v1/catalog-imports` plus status/error-report queries; format and asynchronous behavior remain open.

## Dependencies

Uses Sales line types and shared infrastructure. Session supplies selected store to screens. Checkout, Inventory, Dashboard, Reports, Returns, Holds, and Analytics consume catalog data. Local persistence should become catalog/inventory queries and commands.

## Open Questions

Import schema/rollback, variants, serialized stock, price lists, taxes, deletion policy, supplier ID migration, and SKU uniqueness scope require decisions.

