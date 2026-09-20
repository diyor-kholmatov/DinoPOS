# Routing

React Router owns navigation. `app/router/router.tsx` lazy-loads thin files under `pages/`, and each page re-exports a screen from a module public API.

| Path | Owner |
| --- | --- |
| `/` | redirects to `/checkout` |
| `/checkout` | Checkout |
| `/dashboard` | Dashboard |
| `/catalog`, `/catalog/import` | Catalog |
| `/inventory`, `/inventory/transfers` | Inventory |
| `/customers` | Customers |
| `/reports` | Reports |
| `/sales` | Sales |
| `/suppliers` | Suppliers |
| `/returns` | Returns |
| `/drafts` | Checkout |
| `/holds` | Holds |
| `/shift`, `/cash-operations`, `/register-history` | Register |
| `/settings` | Settings |
| `*` | redirects to `/checkout` |

The base path is centralized in `shared/config/environment.ts`: development uses `/`; production uses `/DinoPOS/`. GitHub Pages finalization creates route fallbacks and legacy `.html` redirects. Route names and URLs were not changed by restructuring.
