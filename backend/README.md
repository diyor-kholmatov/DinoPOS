# DinoPOS landing admin API

Small Spring Boot 4 / Java 21 service for the public landing page:

- `GET /api/public/content` — published landing content;
- `POST /api/public/leads` — create a customer lead;
- `GET /api/admin/leads` — list leads;
- `PATCH /api/admin/leads/{id}/status` — update a lead status;
- `GET` and `PUT /api/admin/content` — read and edit landing content;
- `GET /actuator/health` — deployment health check.

Admin endpoints use HTTP Basic authentication. Public content and leads use CORS restricted to `DINOPOS_ALLOWED_ORIGINS`.

## Local run

```bash
DINOPOS_ADMIN_PASSWORD=change-this \
DINOPOS_ALLOWED_ORIGINS=http://localhost:5173 \
mvn spring-boot:run
```

Or use Docker Compose:

```bash
docker compose up --build
```

## Production environment

Required variables:

| Variable | Purpose |
| --- | --- |
| `DINOPOS_ADMIN_USERNAME` | Admin login |
| `DINOPOS_ADMIN_PASSWORD` | Strong admin password |
| `DINOPOS_ALLOWED_ORIGINS` | Comma-separated frontend origins, for example `https://diyor-kholmatov.github.io` |
| `DINOPOS_DATA_PATH` | Persistent H2 database path, defaults to `./data/dinopos` |
| `PORT` | HTTP port assigned by the host |

The included Dockerfile runs as an unprivileged user and stores the database under `/data`. Attach a persistent volume to that directory.
