# ADR 0003: Document, Do Not Implement, the Future API

- Status: Accepted
- Date: 2026-09-20

## Context

The frontend contains enough behavior to infer integration needs, but backend technology, tenancy, identity, fiscalization, and payment providers are undecided.

## Decision

Document proposed REST contracts, errors, permissions, idempotency, loading, retry, and examples per module. Do not create backend code, schemas, migrations, controllers, or infrastructure.

## Consequences

Backend discovery can start from concrete frontend needs without locking DinoPOS into speculative implementation. Open or conflicting rules remain explicitly labeled.
