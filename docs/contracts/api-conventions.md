# Proposed API Conventions

These conventions describe a future backend contract. They do not imply backend implementation in this repository.

## Base and media type

- Base: `/api/v1`
- JSON: `Content-Type: application/json`
- IDs are opaque strings.
- Dates/times are ISO 8601 UTC timestamps; business dates are `YYYY-MM-DD`.
- Currency is ISO 4217 (`UZS`); money is an integer in the currency's minor unit policy. For UZS examples, integer sums are used.

## Success envelope

```json
{
  "data": { "id": "sale_01J...", "status": "completed" },
  "meta": { "requestId": "req_01J...", "version": "v1" }
}
```

## Error envelope

```json
{
  "error": {
    "code": "STOCK_CHANGED",
    "message": "Available stock changed before payment.",
    "fields": { "lines[0].quantity": "Only 2 units remain." },
    "retryable": false
  },
  "meta": { "requestId": "req_01J...", "traceId": "tr_01J..." }
}
```

Use `400` malformed request, `401` unauthenticated, `403` unauthorized, `404` missing entity, `409` state/version conflict, `422` valid JSON failing business validation, `429` rate limit, and `5xx` server/integration failure.

## Proposed authentication and scope

Use a short-lived bearer access token with tenant, user, role, allowed store IDs, and device/register context. This is an open design requirement; no authentication exists today. Never trust store scope or permissions supplied only in a request body.

## Collections

```http
GET /api/v1/sales?storeId=b1&search=R-10500&status=completed&sort=-createdAt&page[cursor]=abc&page[limit]=50
```

Collection responses return `data` and `meta.page`:

```json
{
  "data": [],
  "meta": {
    "requestId": "req_01J...",
    "page": { "nextCursor": null, "limit": 50, "total": 0 }
  }
}
```

- Search is trimmed, case-insensitive where linguistically appropriate, and documented per resource.
- Filters use explicit repeated or comma-separated values, consistently per endpoint.
- Sorting uses a field name; `-field` means descending.
- Unknown filters/sorts return `400`, not silent fallback.

## Localization and timezone

Clients send `Accept-Language: en|ru|uz` and `X-Time-Zone: Asia/Tashkent`. Machine-readable codes remain language-independent. The server stores UTC timestamps and applies business-day boundaries using the tenant/store timezone.

## Concurrency and idempotency

- Critical POST commands require `Idempotency-Key`: complete sale, refund, transfer send/receive, hold redeem, shift open/close, and cash operation.
- Replaying the same key and same body returns the original response.
- Reusing a key with a different body returns `409 IDEMPOTENCY_CONFLICT`.
- Mutable resources should expose `version`/ETag and reject stale writes with `409 VERSION_CONFLICT`.

## Correlation and audit

Clients send `X-Request-ID` when available; services return `requestId` and `traceId`. Financial/inventory mutations record actor, tenant, store, device, before/after state or ledger entries, timestamp, and command ID.

## Loading, retry, and optimistic updates

- Queries: show cached data where safe, allow cancellation, and retry transient network/`5xx` failures with capped backoff.
- Critical commands: disable duplicate submission while pending and retry only with the same idempotency key.
- Validation/`409` errors are not automatically retried.
- Optimistic UI is allowed for reversible preferences, not sales, balances, stock, shifts, returns, or cash operations.
