# ADR 0002: Browser Persistence Boundary

- Status: Accepted
- Date: 2026-09-20

## Context

Persistent stores repeated direct Local Storage access and literal compatibility keys.

## Decision

Centralize key names in `shared/config/storage-keys.ts` and access in `shared/persistence/storage.ts`. Keep all key values, store versions, and persisted shapes unchanged.

## Consequences

Browser absence is handled in one place, persistence usage is testable/enforceable, and migration compatibility is preserved. Local Storage is still only a prototype data source and must eventually yield to module query/command adapters.
