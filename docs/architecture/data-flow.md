# Data Flow

## Current data sources

```mermaid
flowchart LR
  Seed[Repository seed data] --> Bootstrap[Legacy bootstrap]
  Legacy[(v5 Local Storage)] --> Migration[Migration parser]
  Migration --> Backup[(Untouched v5 backup)]
  Migration --> Bootstrap
  Bootstrap --> Stores[Zustand stores]
  Browser[(v6 Local Storage)] <--> Adapter[Storage adapter]
  Adapter <--> Stores
  Stores --> Screens[Module screens]
  Screens --> Commands[Frontend commands/calculations]
  Commands --> Stores
```

Dashboard demonstration series are deterministic calculations from selected ranges and store seeds. Reports aggregate current sales and operational stores. No production data is fetched from an external service.

## Critical sale flow

```mermaid
sequenceDiagram
  actor Cashier
  participant UI as Checkout UI
  participant Checkout as Checkout model
  participant Catalog
  participant Customer
  participant Register
  participant Sales
  Cashier->>UI: Pay
  UI->>Checkout: completeSale()
  Checkout->>Register: verify mode and shift
  Checkout->>Customer: verify account/payment
  Checkout->>Catalog: validate current stock
  Checkout->>Checkout: calculate subtotal, discount, tax, total
  Checkout->>Catalog: decrement stock and append movements
  Checkout->>Customer: update spend/debt/prepayment/history
  Checkout->>Register: update expected cash/fiscal queue
  Checkout->>Sales: append immutable completed sale
  Checkout->>Checkout: clear cart
  Checkout-->>UI: receipt or failure code
```

## Future boundary

```mermaid
flowchart LR
  UI[React modules] --> Query[Query/command adapters]
  Query --> API[Future versioned HTTP API]
  API --> Auth[Future authorization]
  API --> Domain[Future domain services]
  Domain --> DB[(Future database)]
  API -. correlation/idempotency .-> Query
```

The right side is a proposed integration boundary only. It is not implemented in this repository.
