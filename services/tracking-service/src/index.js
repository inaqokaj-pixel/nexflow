require('dotenv').config();

const express = require('express');
const { Pool }  = require('pg');
const amqp      = require('amqplib');

const app  = express();
const PORT = process.env.PORT || 3006;
app.use(express.json());

// ============ DATABASE ============
const pool = new Pool({
  host:     process.env.DB_HOST     || 'postgres-tracking',
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || 'tracking_db',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123',
});

async function initDatabase() {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  for (let attempt = 1; attempt <= 10; attempt++) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS tracking_updates (
          id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          booking_id  VARCHAR(255) NOT NULL,
          latitude    DECIMAL(10,6),
          longitude   DECIMAL(11,6),
          city        VARCHAR(255),
          status      VARCHAR(50),
          message     TEXT,
          updated_by  VARCHAR(255),
          created_at  TIMESTAMP DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_tracking_booking ON tracking_updates(booking_id);
        CREATE INDEX IF NOT EXISTS idx_tracking_created ON tracking_updates(created_at DESC);

        -- ETA table: simulator writes progress here each tick
        CREATE TABLE IF NOT EXISTS tracking_eta (
          booking_id      VARCHAR(255) PRIMARY KEY,
          steps_total     INT,
          steps_remaining INT,
          tick_ms         INT,
          destination     VARCHAR(255),
          route           TEXT,
          updated_at      TIMESTAMP DEFAULT NOW()
        );
      `);
      console.log('✅ Tracking DB ready');
      return;
    } catch (err) {
      console.error(`❌ DB init attempt ${attempt}/10:`, err.message);
      await delay(3000);
    }
  }
  process.exit(1);
}

// ============ RABBITMQ ============
async function connectRabbitMQ() {
  try {
    const conn    = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://admin:admin123@rabbitmq:5672');
    const channel = await conn.createChannel();
    await channel.assertExchange('nexflow_events', 'topic', { durable: true });

    const q = await channel.assertQueue('tracking_booking_events', { durable: true });
    await channel.bindQueue(q.queue, 'nexflow_events', 'booking.status_changed');
    await channel.bindQueue(q.queue, 'nexflow_events', 'booking.created');

    channel.consume(q.queue, async (msg) => {
      if (!msg) return;
      try {
        const event = JSON.parse(msg.content.toString());
        const { booking_id, new_status, shipper_id } = event.data || {};

        if (booking_id && new_status) {
          const statusMessages = {
            confirmed:  'Booking confirmed. Awaiting pickup.',
            in_transit: 'Shipment picked up and is now in transit.',
            delivered:  'Shipment has been delivered successfully. ✅',
            cancelled:  'Booking has been cancelled.',
          };
          await pool.query(
            `INSERT INTO tracking_updates (booking_id, status, message, updated_by)
             VALUES ($1, $2, $3, $4)`,
            [booking_id, new_status,
             statusMessages[new_status] || `Status updated to ${new_status}`,
             shipper_id || 'system']
          );
          // Clean up ETA when delivered/cancelled
          if (['delivered','cancelled'].includes(new_status)) {
            await pool.query('DELETE FROM tracking_eta WHERE booking_id = $1', [booking_id]);
          }
          console.log(`📍 Auto-tracking: ${booking_id} → ${new_status}`);
        }
      } catch (err) {
        console.error('❌ RabbitMQ event error:', err.message);
      }
      channel.ack(msg);
    });

    console.log('✅ RabbitMQ connected');
  } catch (err) {
    console.error('❌ RabbitMQ failed:', err.message);
    setTimeout(connectRabbitMQ, 5000);
  }
}

// ============ HEALTH ============
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'healthy', service: 'tracking-service' });
  } catch (err) {
    res.status(503).json({ status: 'unhealthy', error: err.message });
  }
});

// ============ UPSERT ETA (called by simulator each tick) ============
app.post('/api/tracking/:bookingId/eta', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { steps_total, steps_remaining, tick_ms, destination, route } = req.body;

    await pool.query(`
      INSERT INTO tracking_eta (booking_id, steps_total, steps_remaining, tick_ms, destination, route, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,NOW())
      ON CONFLICT (booking_id) DO UPDATE
        SET steps_total=$2, steps_remaining=$3, tick_ms=$4,
            destination=$5, route=$6, updated_at=NOW()
    `, [bookingId, steps_total, steps_remaining, tick_ms, destination, route]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ GET STATS ============
app.get('/api/tracking/stats', async (req, res) => {
  try {
    const [total, active, today, cities] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM tracking_updates'),
      pool.query(`SELECT COUNT(DISTINCT booking_id) FROM tracking_updates
                  WHERE status NOT IN ('delivered','cancelled')`),
      pool.query(`SELECT COUNT(*) FROM tracking_updates
                  WHERE created_at > NOW() - INTERVAL '24 hours'`),
      pool.query(`SELECT city, COUNT(*) as visits
                  FROM tracking_updates WHERE city IS NOT NULL
                  GROUP BY city ORDER BY visits DESC LIMIT 5`),
    ]);
    res.json({
      total_updates:   parseInt(total.rows[0].count),
      active_bookings: parseInt(active.rows[0].count),
      updates_today:   parseInt(today.rows[0].count),
      top_cities:      cities.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ GET ACTIVE LATEST (for map) ============
// MUST be before /:bookingId
app.get('/api/tracking/active/latest', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT ON (t.booking_id)
        t.booking_id, t.latitude, t.longitude, t.city, t.status, t.message, t.created_at,
        e.steps_total, e.steps_remaining, e.tick_ms, e.destination, e.route
      FROM tracking_updates t
      LEFT JOIN tracking_eta e ON e.booking_id = t.booking_id
      WHERE t.status NOT IN ('delivered','cancelled')
        AND t.latitude IS NOT NULL
      ORDER BY t.booking_id, t.created_at DESC
    `);
    res.json({ locations: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ GET ALL TRACKINGS SUMMARY (for tracking page list) ============
app.get('/api/tracking/all/summary', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT ON (t.booking_id)
        t.booking_id, t.city, t.status, t.message, t.created_at,
        t.latitude, t.longitude,
        e.steps_total, e.steps_remaining, e.tick_ms, e.destination, e.route
      FROM tracking_updates t
      LEFT JOIN tracking_eta e ON e.booking_id = t.booking_id
      ORDER BY t.booking_id, t.created_at DESC
    `);
    res.json({ trackings: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ GET ETA FOR ONE BOOKING ============
app.get('/api/tracking/:bookingId/eta', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tracking_eta WHERE booking_id = $1',
      [req.params.bookingId]
    );
    if (!result.rows.length) return res.json({ eta: null });

    const eta = result.rows[0];
    const ms_remaining = eta.steps_remaining * eta.tick_ms;
    const eta_time = new Date(Date.now() + ms_remaining);

    res.json({
      eta: {
        ...eta,
        ms_remaining,
        eta_timestamp: eta_time.toISOString(),
        eta_label: formatETA(ms_remaining),
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function formatETA(ms) {
  if (ms <= 0) return 'Arriving soon';
  const minutes = Math.round(ms / 60000);
  const hours   = Math.floor(minutes / 60);
  const mins    = minutes % 60;
  if (hours === 0) return `~${mins}m`;
  return `~${hours}h ${mins}m`;
}

// ============ GET TRACKING HISTORY FOR ONE BOOKING ============
app.get('/api/tracking/:bookingId', async (req, res) => {
  try {
    const [history, eta] = await Promise.all([
      pool.query(
        'SELECT * FROM tracking_updates WHERE booking_id = $1 ORDER BY created_at ASC',
        [req.params.bookingId]
      ),
      pool.query('SELECT * FROM tracking_eta WHERE booking_id = $1', [req.params.bookingId]),
    ]);

    const etaData = eta.rows[0] || null;
    let etaFormatted = null;
    if (etaData) {
      const ms_remaining = etaData.steps_remaining * etaData.tick_ms;
      etaFormatted = {
        ...etaData,
        ms_remaining,
        eta_timestamp: new Date(Date.now() + ms_remaining).toISOString(),
        eta_label: formatETA(ms_remaining),
      };
    }

    res.json({ tracking: history.rows, eta: etaFormatted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ POST LOCATION UPDATE ============
app.post('/api/tracking/:bookingId/update', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { latitude, longitude, city, status, message, updated_by } = req.body;

    const result = await pool.query(
      `INSERT INTO tracking_updates
         (booking_id, latitude, longitude, city, status, message, updated_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [bookingId, latitude||null, longitude||null, city||null,
       status||null, message||null, updated_by||null]
    );
    res.status(201).json({ success: true, update: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ START ============
async function start() {
  await initDatabase();
  await connectRabbitMQ();
  app.listen(PORT, () => console.log(`🚀 Tracking Service on port ${PORT}`));
}
start();
