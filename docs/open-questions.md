# Open Product Questions

These decisions cannot be confirmed from the running frontend.

1. What tenant model, authentication provider, session lifetime, and role matrix will the production system use?
2. Are permissions global, per store, per register, or per operation amount threshold?
3. Which fiscal device/provider and offline fiscal queue rules apply in each market?
4. Which payment providers support card, QR, and transfer, and how are asynchronous confirmations/reversals represented?
5. Is 12% checkout tax fixed, inclusive/exclusive, item-specific, or driven by Settings? The current checkout calculation uses a fixed 12% when fiscalization is enabled.
6. What receipt-number uniqueness scope is required: tenant, store, register, shift, or fiscal device?
7. Can debt exceed a customer credit limit? No credit-limit field exists today.
8. Should prepayment spending be rejected atomically by the backend and represented as an immutable ledger?
9. How should partial returns allocate quantity, discount, tax, cost, and payment tender? The current prototype restores one unit of the first line.
10. Does a held-sale deposit create a customer ledger/payment transaction, and how is it refunded or applied?
11. Do drafts expire, synchronize across devices, or reserve stock? They currently do none of these.
12. Is transfer stock removed when sent, reserved while in transit, or removed only on receipt? The current UI decrements on send and increments on acceptance.
13. What are the full purchase-order states and receiving/partial-payment rules?
14. Must completed stocktakes lock affected stock or reconcile concurrent sales?
15. Are Dashboard demonstration analytics replaced by sales aggregates, precomputed analytics, or a reporting warehouse?
16. Should reports use transaction-time historical supplier/customer balances rather than current totals?
17. What CSV/XLSX schema, validation report, duplicate policy, and rollback rules should Catalog import use?
18. What retention, export, privacy, and audit requirements apply to customer and financial data?
