# NexFlow API Reference

Base URL: `http://localhost:8080`

All protected endpoints require:
```
Authorization: Bearer <jwt_token>
```
Tokens are obtained from `/api/customers/login` or `/api/customers/auth/google` and expire after 24 hours.

---

## Customer Service

### POST /api/customers/register
Register a new shipper or carrier account.

**Auth:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword",
  "role": "shipper"
}
```
`role` must be `"shipper"` or `"carrier"`.

**Response 201:**
```json
{
  "id": "uuid",
  "email": "john@example.com",
  "role": "shipper"
}
```

**Response 400:** Missing fields or email already registered.

---

### POST /api/customers/login
Authenticate and receive a JWT token.

**Auth:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "role": "shipper"
  }
}
```

**Response 401:** Invalid credentials.

---

### POST /api/customers/auth/google
Sign in or register using a Google OAuth access token.

**Auth:** Public

**Request Body:**
```json
{
  "credential": "<google_access_token>",
  "role": "shipper"
}
```
`role` is only used when creating a new account.

**Response 200:**
```json
{
  "token": "eyJ...",
  "user": {
    "id": "uuid",
    "email": "john@gmail.com",
    "role": "shipper",
    "name": "John Doe",
    "avatar": "https://..."
  },
  "isNewUser": false
}
```

---

### GET /api/customers/profile
Get the authenticated user's profile.

**Auth:** JWT required

**Response 200:**
```json
{
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "role": "shipper",
    "name": "John Doe",
    "avatar": null,
    "created_at": "2026-05-01T10:00:00.000Z"
  }
}
```

---

### GET /api/customers/admin/users
List all users. Admin only.

**Auth:** JWT required (role: admin)

**Response 200:**
```json
{
  "users": [
    { "id": "uuid", "email": "...", "role": "shipper", "created_at": "..." }
  ]
}
```

---

### GET /api/customers/admin/stats
Platform-wide user statistics. Admin only.

**Auth:** JWT required (role: admin)

**Response 200:**
```json
{
  "stats": {
    "total_users": "42",
    "total_shippers": "30",
    "total_carriers": "11",
    "new_this_week": "5"
  }
}
```

---

### DELETE /api/customers/admin/users/:id
Delete a user by ID. Admin only. Cannot delete admin accounts.

**Auth:** JWT required (role: admin)

**Response 200:**
```json
{ "success": true }
```

---

## Resource Service

### GET /api/resources/fleet/available
List available fleet vehicles with optional filters.

**Auth:** JWT required

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `vehicle_type` | string | Filter by type: `truck`, `van`, `semi_truck`, `container`, `cargo_plane`, `motorcycle`, `ship`, `train` |
| `min_capacity_kg` | number | Minimum weight capacity |
| `city` | string | Filter by current city (case-insensitive) |
| `page` | integer | Page number (default: 1) |
| `limit` | integer | Results per page (default: 20) |

**Response 200:**
```json
{
  "vehicles": [
    {
      "_id": "mongo_id",
      "carrier_id": "uuid",
      "vehicle_type": "truck",
      "capacity": { "weight_kg": 5000, "volume_m3": 40 },
      "current_location": {
        "type": "Point",
        "coordinates": [19.81, 41.33],
        "city": "Tirana",
        "country": "Albania"
      },
      "availability": { "status": "available", "available_from": "2026-05-01T00:00:00.000Z" },
      "specifications": {
        "refrigerated": false,
        "hazmat_certified": true,
        "license_plate": "AA123BB",
        "year": 2022,
        "make": "Mercedes",
        "model": "Actros"
      }
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 3,
    "total_vehicles": 50,
    "per_page": 20
  }
}
```

---

### POST /api/resources/fleet
Add a new vehicle to the fleet.

**Auth:** JWT required (role: carrier)

**Request Body:**
```json
{
  "carrier_id": "uuid",
  "vehicle_type": "truck",
  "capacity": { "weight_kg": 5000, "volume_m3": 40 },
  "current_location": {
    "coordinates": [19.81, 41.33],
    "city": "Tirana",
    "country": "Albania"
  },
  "specifications": {
    "refrigerated": false,
    "hazmat_certified": false,
    "license_plate": "AA123BB",
    "year": 2022,
    "make": "Mercedes",
    "model": "Actros"
  }
}
```

**Response 201:**
```json
{ "success": true, "vehicle": { ... } }
```

---

### GET /api/resources/fleet/:id
Get details of a specific vehicle.

**Auth:** JWT required

**Response 200:**
```json
{ "vehicle": { ... } }
```

**Response 404:** Vehicle not found.

---

### PUT /api/resources/fleet/:id/availability
Update a vehicle's availability status.

**Auth:** JWT required

**Request Body:**
```json
{
  "status": "reserved",
  "reserved_until": "2026-06-01T00:00:00.000Z"
}
```
`status` must be one of: `available`, `reserved`, `in_transit`, `maintenance`.

**Response 200:**
```json
{ "success": true, "message": "Availability updated", "vehicle": { ... } }
```

---

### GET /api/resources/routes
Search available shipping routes.

**Auth:** JWT required

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `origin_city` | string | Filter by origin city (case-insensitive) |
| `destination_city` | string | Filter by destination city (case-insensitive) |
| `page` | integer | Page number (default: 1) |
| `limit` | integer | Results per page (default: 20) |

**Response 200:**
```json
{
  "routes": [
    {
      "_id": "mongo_id",
      "carrier_id": "uuid",
      "origin": { "city": "Tirana", "country": "Albania", "coordinates": [19.81, 41.33] },
      "destination": { "city": "Rome", "country": "Italy", "coordinates": [12.49, 41.90] },
      "estimated_duration_hours": 18,
      "cost_per_kg": 2.5,
      "active": true
    }
  ],
  "pagination": { "current_page": 1, "total_pages": 2, "total_routes": 35 }
}
```

---

### POST /api/resources/routes
Create a new shipping route.

**Auth:** JWT required (role: carrier)

**Request Body:**
```json
{
  "carrier_id": "uuid",
  "origin": { "city": "Tirana", "country": "Albania", "coordinates": [19.81, 41.33] },
  "destination": { "city": "Rome", "country": "Italy", "coordinates": [12.49, 41.90] },
  "estimated_duration_hours": 18,
  "cost_per_kg": 2.5
}
```

**Response 201:**
```json
{ "success": true, "route": { ... } }
```

---

### GET /api/resources/routes/:id
Get details of a specific route.

**Auth:** JWT required

**Response 200:**
```json
{ "route": { ... } }
```

---

## Booking Service

### GET /api/bookings
List bookings. Optionally filter by shipper.

**Auth:** JWT required

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `shipper_id` | uuid | Filter to a specific shipper's bookings |

**Response 200:**
```json
{
  "bookings": [
    {
      "id": "uuid",
      "shipper_id": "uuid",
      "carrier_id": "uuid",
      "resource_id": "mongo_id",
      "route_id": "mongo_id",
      "pickup_location": { "city": "Tirana", "country": "Albania", "address": "Rruga e Elbasanit 1" },
      "delivery_location": { "city": "Rome", "country": "Italy", "address": "Via Roma 42" },
      "cargo_details": { "weight_kg": 150, "volume_m3": 2, "description": "Electronics" },
      "pickup_date": "2026-06-10T08:00:00.000Z",
      "estimated_delivery": "2026-06-11T12:00:00.000Z",
      "status": "pending",
      "total_cost": "675.00",
      "created_at": "2026-05-29T10:00:00.000Z",
      "updated_at": "2026-05-29T10:00:00.000Z"
    }
  ]
}
```

---

### GET /api/bookings/:id
Get a single booking by ID.

**Auth:** JWT required

**Response 200:**
```json
{ "booking": { ... } }
```

**Response 404:** Booking not found.

---

### POST /api/bookings
Create a new shipment booking. Automatically calculates cost and publishes `booking.created` event.

**Auth:** JWT required

**Cost Calculation:**
- Base fee: $25
- Per kg: $4/kg
- International surcharge (different countries): +$50
- Heavy cargo (>20 kg): +$40

**Request Body:**
```json
{
  "shipper_id": "uuid",
  "carrier_id": "uuid",
  "resource_id": "mongo_id",
  "route_id": "mongo_id",
  "pickup_location": {
    "city": "Tirana",
    "country": "Albania",
    "address": "Rruga e Elbasanit 1",
    "coordinates": [19.81, 41.33]
  },
  "delivery_location": {
    "city": "Rome",
    "country": "Italy",
    "address": "Via Roma 42",
    "coordinates": [12.49, 41.90]
  },
  "cargo_details": {
    "weight_kg": 150,
    "volume_m3": 2,
    "description": "Electronics"
  },
  "pickup_date": "2026-06-10T08:00:00.000Z",
  "estimated_delivery": "2026-06-11T12:00:00.000Z"
}
```

**Response 201:**
```json
{
  "success": true,
  "booking": {
    "id": "uuid",
    "status": "pending",
    "total_cost": "675.00",
    ...
  }
}
```

---

### PUT /api/bookings/:id/status
Update the status of a booking. Publishes `booking.status_changed` event.

**Auth:** JWT required (role: carrier or admin)

**Request Body:**
```json
{
  "status": "confirmed",
  "shipper_id": "uuid"
}
```

Valid statuses: `pending`, `confirmed`, `in_transit`, `delivered`, `cancelled`.

**Response 200:**
```json
{ "success": true, "booking": { ... } }
```

---

### DELETE /api/bookings/:id
Cancel a booking. Sets status to `cancelled` and publishes `booking.cancelled` event.

**Auth:** JWT required

**Response 200:**
```json
{ "success": true, "booking": { "status": "cancelled", ... } }
```

**Response 404:** Booking not found.

---

## Payment Service

### POST /api/payments/process
Process payment for a booking via Stripe. Publishes `payment.completed` event on success.

**Auth:** JWT required

**Request Body:**
```json
{
  "booking_id": "uuid",
  "user_id": "uuid",
  "amount": 675.00,
  "currency": "USD",
  "payment_method": "credit_card",
  "payment_method_id": "pm_card_visa"
}
```

`payment_method_id` is a Stripe PaymentMethod ID. In test mode, use `pm_card_visa`.

**Response 200:**
```json
{
  "success": true,
  "payment": {
    "id": "uuid",
    "booking_id": "uuid",
    "amount": 675.00,
    "currency": "USD",
    "payment_status": "completed",
    "transaction_id": "pi_stripe_intent_id",
    "invoice_number": "INV-202605-AB1C2D",
    "processed_at": "2026-05-29T10:05:00.000Z"
  }
}
```

**Response 402:** Payment declined.

**Response 409:** Payment already processed for this booking.

---

### GET /api/payments/:id
Get payment details and associated invoice.

**Auth:** JWT required

**Response 200:**
```json
{
  "payment": { "id": "uuid", "payment_status": "completed", ... },
  "invoice": { "id": "uuid", "invoice_number": "INV-...", "generated_at": "..." }
}
```

---

### GET /api/payments/booking/:bookingId
Get payment by booking ID.

**Auth:** JWT required

**Response 200:**
```json
{ "payment": { ... } }
```

---

### POST /api/payments/:id/refund
Process a refund for a completed payment.

**Auth:** JWT required (role: admin or carrier)

**Request Body:**
```json
{
  "reason": "Customer requested cancellation",
  "refund_amount": 675.00
}
```
`refund_amount` defaults to the full payment amount if omitted.

**Response 200:**
```json
{
  "success": true,
  "refund": {
    "id": "uuid",
    "payment_id": "uuid",
    "refund_amount": 675.00,
    "refund_status": "completed",
    "refund_transaction_id": "txn_...",
    "estimated_completion": "2026-06-03T10:05:00.000Z"
  }
}
```

---

## Notification Service

### GET /api/notifications/user/:userId
Get notifications for a user (most recent 50).

**Auth:** JWT required

**Response 200:**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "type": "email",
      "subject": "Booking Confirmation - NexFlow",
      "message": "Your Shipment Booking is Confirmed!\n\nBooking ID: ...",
      "status": "sent",
      "metadata": { "booking_id": "uuid", "event_type": "booking.created" },
      "sent_at": "2026-05-29T10:01:00.000Z",
      "created_at": "2026-05-29T10:00:30.000Z"
    }
  ]
}
```

---

### PUT /api/notifications/:id/read
Mark a notification as read.

**Auth:** JWT required

**Response 200:**
```json
{ "notification": { "id": "uuid", "status": "read", ... } }
```

---

## Tracking Service

### GET /api/tracking/:bookingId
Get the full tracking history for a booking.

**Auth:** JWT required

**Response 200:**
```json
{
  "tracking": [
    {
      "id": "uuid",
      "booking_id": "uuid",
      "latitude": 41.330,
      "longitude": 19.816,
      "city": "Tirana",
      "status": "in_transit",
      "message": "Shipment picked up and is now in transit.",
      "updated_by": "carrier_uuid",
      "created_at": "2026-05-29T12:00:00.000Z"
    }
  ]
}
```

---

### POST /api/tracking/:bookingId/update
Manually push a tracking update.

**Auth:** JWT required

**Request Body:**
```json
{
  "latitude": 41.89,
  "longitude": 12.49,
  "city": "Rome",
  "status": "in_transit",
  "message": "Arrived at destination hub"
}
```

**Response 200:**
```json
{ "success": true, "update": { ... } }
```

---

### GET /api/tracking/:bookingId/eta
Get current ETA information for a booking.

**Auth:** JWT required

**Response 200:**
```json
{
  "booking_id": "uuid",
  "steps_total": 20,
  "steps_remaining": 12,
  "destination": "Rome",
  "estimated_arrival_pct": 40,
  "updated_at": "2026-05-29T13:00:00.000Z"
}
```

---

## Health Endpoints

All services expose a health endpoint — no auth required at the service level (not proxied through gateway).

| Service | URL |
|---------|-----|
| API Gateway | GET http://localhost:8080/health |
| Customer | GET http://localhost:3001/health |
| Resource | GET http://localhost:3002/health |
| Booking | GET http://localhost:3003/health |
| Payment | GET http://localhost:3004/health |
| Notification | GET http://localhost:3005/health |
| Tracking | GET http://localhost:3006/health |

**Response 200:**
```json
{
  "status": "healthy",
  "service": "booking-service",
  "database": "connected",
  "timestamp": "2026-05-29T10:00:00.000Z"
}
```

---

## Error Responses

All endpoints return errors in a consistent format:

```json
{ "error": "Human-readable error message" }
```

| HTTP Status | Meaning |
|------------|---------|
| 400 | Bad request — missing or invalid fields |
| 401 | No token provided |
| 402 | Payment declined |
| 403 | Forbidden — insufficient role |
| 404 | Resource not found |
| 409 | Conflict — e.g. duplicate payment |
| 502 | Upstream service unavailable |
| 500 | Internal server error |

---

## Event Reference

Events are published to the `nexflow_events` RabbitMQ topic exchange.

| Routing Key | Publisher | Payload Fields |
|-------------|-----------|----------------|
| `booking.created` | booking-service | `booking_id`, `shipper_id`, `carrier_id`, `resource_id`, `total_cost`, `pickup_date`, `delivery_location` |
| `booking.status_changed` | booking-service | `booking_id`, `shipper_id`, `new_status` |
| `booking.cancelled` | booking-service | `booking_id`, `shipper_id` |
| `payment.completed` | payment-service | `payment_id`, `booking_id`, `user_id`, `amount`, `transaction_id` |
| `payment.failed` | payment-service | `payment_id`, `booking_id`, `user_id`, `error` |
| `payment.refunded` | payment-service | `payment_id`, `booking_id`, `user_id`, `refund_amount`, `refund_transaction_id` |
| `user.registered` | customer-service | `user_id`, `email`, `role` |
| `resource.fleet_added` | resource-service | `vehicle_id`, `carrier_id`, `vehicle_type` |
| `resource.availability_updated` | resource-service | `vehicle_id`, `status`, `carrier_id` |
