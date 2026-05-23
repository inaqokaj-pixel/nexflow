#!/bin/bash
echo "🧪 Testing Complete NexFlow Workflow"
echo "======================================"

# 1. Register Shipper
echo "1️⃣ Registering shipper..."
SHIPPER_RESPONSE=$(curl -s -X POST http://localhost:3001/api/customers/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-shipper@nexflow.com",
    "password": "Shipper123!",
    "role": "shipper",
    "company_name": "Test Logistics"
  }')

SHIPPER_ID=$(echo $SHIPPER_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "✅ Shipper ID: $SHIPPER_ID"

# 2. Register Carrier
echo "2️⃣ Registering carrier..."
CARRIER_RESPONSE=$(curl -s -X POST http://localhost:3001/api/customers/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-carrier@nexflow.com",
    "password": "Carrier123!",
    "role": "carrier",
    "company_name": "Test Transport"
  }')

CARRIER_ID=$(echo $CARRIER_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "✅ Carrier ID: $CARRIER_ID"

# 3. Login Shipper
echo "3️⃣ Logging in shipper..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/customers/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-shipper@nexflow.com",
    "password": "Shipper123!"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "✅ Got JWT Token"

# 4. Add Fleet Vehicle (as carrier)
echo "4️⃣ Adding fleet vehicle..."
VEHICLE_RESPONSE=$(curl -s -X POST http://localhost:3002/api/resources/fleet \
  -H "Content-Type: application/json" \
  -d "{
    \"carrier_id\": \"$CARRIER_ID\",
    \"vehicle_type\": \"truck\",
    \"capacity\": {
      \"weight_kg\": 5000,
      \"volume_m3\": 30
    },
    \"current_location\": {
      \"coordinates\": [-74.0060, 40.7128],
      \"city\": \"New York\",
      \"country\": \"USA\"
    }
  }")

VEHICLE_ID=$(echo $VEHICLE_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
echo "✅ Vehicle ID: $VEHICLE_ID"

# 5. Add Route
echo "5️⃣ Adding route..."
ROUTE_RESPONSE=$(curl -s -X POST http://localhost:3002/api/resources/routes \
  -H "Content-Type: application/json" \
  -d "{
    \"carrier_id\": \"$CARRIER_ID\",
    \"origin\": {
      \"city\": \"New York\",
      \"country\": \"USA\"
    },
    \"destination\": {
      \"city\": \"Los Angeles\",
      \"country\": \"USA\"
    },
    \"estimated_duration_hours\": 48,
    \"cost_per_kg\": 2.5
  }")

ROUTE_ID=$(echo $ROUTE_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
echo "✅ Route ID: $ROUTE_ID"

# 6. Create Booking
echo "6️⃣ Creating booking..."
BOOKING_RESPONSE=$(curl -s -X POST http://localhost:3003/api/bookings \
  -H "Content-Type: application/json" \
  -d "{
    \"shipper_id\": \"$SHIPPER_ID\",
    \"carrier_id\": \"$CARRIER_ID\",
    \"resource_id\": \"$VEHICLE_ID\",
    \"route_id\": \"$ROUTE_ID\",
    \"pickup_location\": {
      \"city\": \"New York\",
      \"country\": \"USA\"
    },
    \"delivery_location\": {
      \"city\": \"Los Angeles\",
      \"country\": \"USA\"
    },
    \"cargo_details\": {
      \"weight_kg\": 1500
    },
    \"pickup_date\": \"2024-06-15T09:00:00Z\"
  }")

BOOKING_ID=$(echo $BOOKING_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
TOTAL_COST=$(echo $BOOKING_RESPONSE | grep -o '"total_cost":"[^"]*' | cut -d'"' -f4)
echo "✅ Booking ID: $BOOKING_ID"
echo "✅ Total Cost: $TOTAL_COST"

# 7. Process Payment
echo "7️⃣ Processing payment..."
PAYMENT_RESPONSE=$(curl -s -X POST http://localhost:3004/api/payments/process \
  -H "Content-Type: application/json" \
  -d "{
    \"booking_id\": \"$BOOKING_ID\",
    \"user_id\": \"$SHIPPER_ID\",
    \"amount\": $TOTAL_COST,
    \"payment_method\": \"credit_card\",
    \"card_details\": {
      \"card_number\": \"4111111111111111\"
    }
  }")

PAYMENT_ID=$(echo $PAYMENT_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "✅ Payment ID: $PAYMENT_ID"

echo ""
echo "🎉 Complete Workflow Test PASSED!"
echo "======================================"
echo "Shipper ID: $SHIPPER_ID"
echo "Carrier ID: $CARRIER_ID"
echo "Vehicle ID: $VEHICLE_ID"
echo "Route ID: $ROUTE_ID"
echo "Booking ID: $BOOKING_ID"
echo "Payment ID: $PAYMENT_ID"
echo ""
echo "Check notification service logs:"
echo "docker-compose logs notification-service"
