# NexFlow — Smart Logistics Booking Platform

A microservices-based logistics platform that connects shippers and carriers for freight booking, real-time tracking, and payment processing.

## Architecture Overview

```
                        ┌──────────────┐
                        │   Frontend   │  :3000
                        │   React SPA  │
                        └──────┬───────┘
                               │
                        ┌──────▼───────┐
                        │  API Gateway │  :8080  (JWT auth, routing)
                        └──────┬───────┘
          ┌──────────┬─────────┼──────────┬──────────┬──────────┐
          │          │         │          │          │          │
    ┌─────▼──┐  ┌────▼───┐ ┌──▼──────┐ ┌─▼──────┐ ┌▼───────┐ ┌▼────────┐
    │Customer│  │Resource│ │Booking  │ │Payment │ │Notific.│ │Tracking│
    │  :3001 │  │  :3002 │ │  :3003  │ │  :3004 │ │  :3005 │ │  :3006 │
    └─────┬──┘  └────┬───┘ └──┬──────┘ └─┬──────┘ └┬───────┘ └┬───────┘
          │          │        │           │          │           │
    ┌─────▼──┐  ┌────▼───┐ ┌──▼──────┐ ┌─▼──────┐  │           │
    │Postgres│  │MongoDB │ │Postgres │ │Postgres│  │           │
    │customer│  │resource│ │booking  │ │payment │  │      ┌────▼────┐
    └────────┘  └────────┘ └─────────┘ └────────┘  │      │Postgres │
                                                    │      │tracking │
                                        ┌───────────▼──────┴────────┐
                                        │      RabbitMQ              │
                                        │  (nexflow_events exchange) │
                                        │  booking.created           │
                                        │  booking.status_changed    │
                                        │  booking.cancelled         │
                                        │  payment.completed         │
                                        │  user.registered           │
                                        └────────────────────────────┘
```

## Services

| Service | Port | Database | Description |
|---------|------|----------|-------------|
| API Gateway | 8080 | — | Single entry point, JWT validation, request routing |
| Customer Service | 3001 | PostgreSQL | Registration, login (email + Google OAuth), user profiles |
| Resource Service | 3002 | MongoDB | Fleet vehicles, shipping routes, availability management |
| Booking Service | 3003 | PostgreSQL | Create/cancel shipment reservations, cost calculation |
| Payment Service | 3004 | PostgreSQL | Stripe-integrated payment processing, invoices, refunds |
| Notification Service | 3005 | PostgreSQL | Event-driven email notifications via RabbitMQ |
| Tracking Service | 3006 | PostgreSQL | Real-time shipment location and ETA tracking |
| Frontend | 3000 | — | React SPA for shippers, carriers, and admins |

**Infrastructure:** RabbitMQ :5672 (management :15672) · Redis :6379

## Prerequisites

- Docker ≥ 24
- Docker Compose ≥ 2.20
- A Stripe test secret key (`sk_test_…`)

## Quick Start

```bash
# 1. Clone the repository
git clone <repo-url>
cd nexflow

# 2. Set environment variables
cp .env.example .env
# Edit .env and fill in:
#   STRIPE_SECRET_KEY=sk_test_...
#   GOOGLE_CLIENT_ID=...   (optional, for Google Sign-In)

# 3. Start everything
docker compose up --build

# 4. Open the app
open http://localhost:3000
```

Services start in dependency order. First boot takes ~2 minutes for all databases to initialize.

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@nexflow.com | admin123 |
| Demo Shipper | Register at /login | — |
| Demo Carrier | Register at /login | — |

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
STRIPE_SECRET_KEY=sk_test_your_key_here
GOOGLE_CLIENT_ID=your_google_client_id   # optional
```

All other configuration is handled automatically by `docker-compose.yml`.

## API

All API requests go through the gateway at `http://localhost:8080`.

Protected endpoints require `Authorization: Bearer <token>` (JWT returned from login).

| Route | Method | Auth | Description |
|-------|--------|------|-------------|
| `/api/customers/register` | POST | Public | Register new user |
| `/api/customers/login` | POST | Public | Login, returns JWT |
| `/api/customers/auth/google` | POST | Public | Google OAuth |
| `/api/customers/profile` | GET | JWT | Get current user |
| `/api/resources/fleet/available` | GET | JWT | List available vehicles |
| `/api/resources/fleet/:id/availability` | PUT | JWT | Update vehicle status |
| `/api/resources/routes` | GET | JWT | Search routes |
| `/api/bookings` | GET | JWT | List bookings |
| `/api/bookings` | POST | JWT | Create booking |
| `/api/bookings/:id` | DELETE | JWT | Cancel booking |
| `/api/payments/process` | POST | JWT | Process payment |
| `/api/notifications/user/:userId` | GET | JWT | Get notifications |
| `/api/tracking/:bookingId` | GET | JWT | Get tracking history |

Full API documentation: [`docs/api.md`](docs/api.md)

## Event-Driven Architecture

The platform uses RabbitMQ topic exchange `nexflow_events` for async communication:

| Event | Publisher | Subscriber(s) |
|-------|-----------|---------------|
| `booking.created` | Booking Service | Notification, Tracking |
| `booking.status_changed` | Booking Service | Notification, Tracking |
| `booking.cancelled` | Booking Service | Notification, Tracking |
| `payment.completed` | Payment Service | Notification |
| `user.registered` | Customer Service | Notification |

## Monitoring

- **RabbitMQ Management UI:** http://localhost:15672 (admin / admin123)
- **Service health endpoints:** `GET http://localhost:<port>/health`
- **Gateway health:** http://localhost:8080/health

## Project Structure

```
nexflow/
├── docker-compose.yml
├── .env
├── frontend/                  # React SPA
│   └── src/
├── services/
│   ├── api-gateway/           # Express proxy + JWT auth
│   ├── customer-service/      # Auth, profiles (PostgreSQL)
│   ├── resource-service/      # Fleet, routes (MongoDB)
│   ├── booking-service/       # Reservations (PostgreSQL)
│   ├── payment-service/       # Stripe payments (PostgreSQL)
│   ├── notification-service/  # Email notifications (PostgreSQL)
│   ├── tracking-service/      # GPS tracking (PostgreSQL)
│   └── location-simulator/    # Dev tool: simulates carrier movement
└── docs/
    ├── api.md                 # Full API reference
    └── report.docx            # Technical report
```

## Development

To run a single service locally for development:

```bash
cd services/customer-service
npm install
cp .env .env.local
# Set DB_HOST=localhost and ensure postgres is running
node src/index.js
```

To view logs for a specific service:

```bash
docker compose logs -f booking-service
```

To rebuild a single service after code changes:

```bash
docker compose up --build booking-service
```
