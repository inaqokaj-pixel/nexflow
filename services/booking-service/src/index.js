require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');
const amqp = require('amqplib');

const app = express();
app.use(express.json());



// ================= DATABASE =================
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'booking_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123'
});

// ================= RABBITMQ =================
let channel;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(
      process.env.RABBITMQ_URL || 'amqp://admin:admin123@rabbitmq:5672'
    );

    channel = await connection.createChannel();

    await channel.assertExchange('nexflow_events', 'topic', {
      durable: true
    });

    console.log('✅ RabbitMQ connected');
  } catch (error) {
    console.error('❌ RabbitMQ connection failed:', error.message);
    setTimeout(connectRabbitMQ, 5000);
  }
}

// ================= EVENT PUBLISHER =================
async function publishEvent(eventType, data) {
  if (!channel) {
    console.error('❌ RabbitMQ channel not ready');
    return;
  }

  const event = {
    event_type: eventType,
    data,
    timestamp: new Date().toISOString()
  };

  channel.publish(
    'nexflow_events',
    eventType,
    Buffer.from(JSON.stringify(event))
  );

  console.log(`📤 Event published: ${eventType}`);
}

function calculateShippingCost(cargo_details, pickup_location, delivery_location) {
  const weight = parseFloat(cargo_details?.weight_kg || 1);

  let cost = 25;

  cost += weight * 4;

  if (
    pickup_location?.country &&
    delivery_location?.country &&
    pickup_location.country !== delivery_location.country
  ) {
    cost += 50;
  }

  if (weight > 20) {
    cost += 40;
  }

  return Number(cost.toFixed(2));
}

// ================= DATABASE INIT =================
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        shipper_id VARCHAR(255),
        carrier_id VARCHAR(255),
        resource_id VARCHAR(255),
        route_id VARCHAR(255),
        pickup_location JSONB,
        delivery_location JSONB,
        cargo_details JSONB,
        pickup_date TIMESTAMP,
        estimated_delivery TIMESTAMP,
        status VARCHAR(50) DEFAULT 'pending',
        total_cost DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✅ Booking DB ready');
  } catch (err) {
    console.error('❌ DB error:', err.message);
  }
}

// ================= HEALTH CHECK =================
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'healthy',
      service: 'booking-service',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      service: 'booking-service',
      database: 'disconnected',
      error: error.message
    });
  }
});

// ================= GET ALL BOOKINGS =================
app.get('/api/bookings', async (req, res) => {
  try {
    const { shipper_id } = req.query;

    let result;
    if (shipper_id) {
      result = await pool.query(
        'SELECT * FROM bookings WHERE shipper_id = $1 ORDER BY created_at DESC',
        [shipper_id]
      );
    } else {
      result = await pool.query(
        'SELECT * FROM bookings ORDER BY created_at DESC'
      );
    }

    res.json({ bookings: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= GET SINGLE BOOKING =================
app.get('/api/bookings/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM bookings WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= CREATE BOOKING =================
app.post('/api/bookings', async (req, res) => {
  try {
    const {
      shipper_id,
      carrier_id,
      resource_id,
      route_id,
      pickup_location,
      delivery_location,
      cargo_details,
      pickup_date,
      estimated_delivery
    } = req.body;

    if (!shipper_id || !carrier_id) {
      return res.status(400).json({
        error: 'shipper_id and carrier_id are required'
      });
    }

    const totalCost = calculateShippingCost(
  cargo_details,
  pickup_location,
  delivery_location
    );

    const result = await pool.query(
      `INSERT INTO bookings (
        shipper_id, carrier_id, resource_id, route_id,
        pickup_location, delivery_location, cargo_details,
        pickup_date, estimated_delivery, status, total_cost
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'pending',$10)
      RETURNING *`,
          [
      shipper_id,
      carrier_id,
      resource_id,
      route_id,
      JSON.stringify(pickup_location),
      JSON.stringify(delivery_location),
      JSON.stringify(cargo_details),
      pickup_date,
      estimated_delivery,
      totalCost
    ]
    );

    const booking = result.rows[0];

    await publishEvent('booking.created', {
      booking_id: booking.id,
      shipper_id,
      carrier_id,
      resource_id,
      route_id,
      total_cost: booking.total_cost,
      pickup_date: booking.pickup_date,
      delivery_location: booking.delivery_location
    });

    res.status(201).json({
      success: true,
      booking
    });

  } catch (err) {
    console.error('BOOKING ERROR:', err.message);
    res.status(500).json({ error: 'Booking failed' });
  }
});

// ================= UPDATE STATUS =================
app.put('/api/bookings/:id/status', async (req, res) => {
  try {
    const { status, shipper_id } = req.body;

    const result = await pool.query(
      `UPDATE bookings
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = result.rows[0];

    await publishEvent('booking.status_changed', {
      booking_id: booking.id,
      shipper_id: shipper_id || booking.shipper_id,
      new_status: status
    });

    res.json({ success: true, booking });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= CANCEL BOOKING =================
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE bookings
       SET status = 'cancelled', updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = result.rows[0];

    await publishEvent('booking.cancelled', {
      booking_id: booking.id,
      shipper_id: booking.shipper_id
    });

    res.json({ success: true, booking });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3003;

async function start() {
  await initDatabase();
  await connectRabbitMQ();

  app.listen(PORT, () => {
    console.log(`🚀 Booking Service running on port ${PORT}`);
  });
}

start();
