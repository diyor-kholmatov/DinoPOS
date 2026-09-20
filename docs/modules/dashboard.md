# Dashboard Module

## Purpose

Dashboard gives an owner or manager a compact network/store overview: selected scope, sales trend, period comparison, urgent stock exceptions, and store performance. It is not a replacement for full Inventory or Reports.

## Related Screens

- `/dashboard`: approved analytical workspace.
- Screen: `modules/dashboard/screens/dashboard-screen.tsx`.
- Public entry: `modules/dashboard/index.ts`.
- Uses Analytics filters/chart, Catalog availability, Session stores, and shared workspace patterns.

## Functionality

Select all/one/multiple stores; choose preset/custom period; choose compatible chart detail; inspect smooth ECharts tooltip/active point; zoom dense datasets; view total and previous comparison; inspect per-store summary; see at most three urgent stock exceptions; open Checkout or Inventory; review compact store performance. Empty/low-data/error layout behavior is represented through shared patterns and chart configuration.

## Entities and Fields

Dashboard owns no persisted entity. It consumes selected `Store`, `Product`, generated `DashboardAnalytics`, and derived urgent-stock rows. Filters comprise selected store IDs, period, range, and granularity.

## Business Rules

| Status | Rule |
| --- | --- |
| Confirmed | Selected store scope is the primary H1 context (`All stores` or selected scope). |
| Confirmed | One period/range applies to all Dashboard analytical indicators. |
| Confirmed | Chart granularity only changes the sales chart buckets and remains compatible with range duration. |
| Confirmed | Chart total, summary, tooltip, labels, and previous comparison use one Analytics result. |
| Confirmed | Low-stock area shows no more than three urgent exceptions and links to Inventory for the full list. |
| Confirmed | Lime is reserved for the compact New Sale action/selected action states; data series use Option A data colors. |
| Confirmed | The approved 176px labeled desktop Sidebar and fluid workspace are preserved. |
| Inferred | The Dashboard is managerial rather than cashier-first because operational actions are secondary to analysis. |
| Open question | Which real metrics replace deterministic demonstration series at launch. |

## States and Transitions

The module has filter state, chart hover/zoom state, and derived empty/low-data states; it owns no domain transition. Analytics documents filter transitions.

## User Flows

**Review network:** owner opens Dashboard, selects all or a store subset, picks period/date, optionally changes chart detail, inspects total/tooltip/store summary, and follows urgent stock to Inventory. **Start sale:** use compact New Sale action to navigate to Checkout.

## Current Data Handling

Stores and products come from persisted client stores. Sales-series values are deterministic frontend demo data and do not read Sales. Stock exceptions use current selected-store product availability. Filter state is not persisted. No external metrics source exists.

## Future Frontend/Backend Contracts

### Dashboard overview

| Item | Proposal |
| --- | --- |
| Method/endpoint | `GET /api/v1/dashboard/overview` |
| Consumer | Dashboard screen |
| Parameters | store IDs, from/to, granularity, timezone |
| Response | consistent sales series/current/previous totals, store summary, up to three urgent exceptions |
| Errors/status | `200`, `400`, `401/403`; partial integration failures should be explicit, not silently zeroed |
| Permission/loading/retry | `dashboard:read`; cancel stale filters, retain previous view while loading, retry transient reads |

```json
{
  "data": {
    "sales": { "total": 11883920000, "previousTotal": 10983000000, "comparisonPercent": 8.2, "series": [] },
    "stores": [{ "id": "b1", "name": "Airport Kiosk", "revenue": 5942000000, "orders": 126 }],
    "urgentStock": [{ "productId": "p6", "storeId": "b1", "available": 2, "severity": "critical" }]
  },
  "meta": { "requestId": "req_01J...", "generatedAt": "2026-09-20T08:30:00Z" }
}
```

This endpoint may internally compose services, but the frontend needs one coherent snapshot to prevent mismatched totals and series.

## Dependencies

Uses Analytics, Catalog, Session, ECharts shared data components, and router navigation. Inventory and Checkout receive navigation only. Future Dashboard/Analytics queries replace demo calculations without changing visual composition.

## Open Questions

Real KPI definitions, stock threshold source, freshness/SLA, permissions, target/goal support, and whether summaries include returns/tax require decisions.

