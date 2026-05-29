require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const amqp = require('amqplib');

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'customer_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123',
});

const JWT_SECRET = process.env.JWT_SECRET || 'nexflow_secret_key';
const PORT = process.env.PORT || 3001;

// ── RABBITMQ ──────────────────────────────────────────────────────────────────
let mqChannel = null;

async function connectRabbitMQ() {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  for (let attempt = 1; attempt <= 10; attempt++) {
    try {
      const connection = await amqp.connect(
        process.env.RABBITMQ_URL || 'amqp://admin:admin123@rabbitmq:5672'
      );
      mqChannel = await connection.createChannel();
      await mqChannel.assertExchange('nexflow_events', 'topic', { durable: true });
      console.log('✅ Connected to RabbitMQ');

      connection.on('close', () => {
        console.warn('⚠️ RabbitMQ connection closed, reconnecting...');
        mqChannel = null;
        setTimeout(connectRabbitMQ, 5000);
      });
      return;
    } catch (err) {
      console.error(`❌ RabbitMQ not ready (attempt ${attempt}/10): ${err.message}`);
      await delay(3000);
    }
  }
  console.warn('⚠️ Could not connect to RabbitMQ – welcome emails will be skipped');
}

async function publishEvent(routingKey, data) {
  if (!mqChannel) return;
  try {
    mqChannel.publish(
      'nexflow_events',
      routingKey,
      Buffer.from(JSON.stringify({ event_type: routingKey, data })),
      { persistent: true }
    );
  } catch (err) {
    console.error(`❌ Failed to publish ${routingKey}:`, err.message);
  }
}

// ── DB INIT ──────────────────────────────────────────────────────────────────
async function initDB() {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  for (let attempt = 1; attempt <= 10; attempt++) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT,
          role TEXT NOT NULL CHECK (role IN ('shipper','carrier','admin')),
          google_id TEXT UNIQUE,
          name TEXT,
          avatar TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID UNIQUE REFERENCES users(id),
          company_name TEXT,
          contact_phone TEXT,
          address TEXT
        );

        -- Migrations: make password_hash nullable and add Google columns
        -- These are safe to run repeatedly (ALTER COLUMN … DROP NOT NULL is idempotent via DO block)
        DO $$
        BEGIN
          ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
        EXCEPTION WHEN others THEN NULL;
        END $$;

        ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT;

        DO $$
        BEGIN
          ALTER TABLE users ADD CONSTRAINT users_google_id_unique UNIQUE (google_id);
        EXCEPTION WHEN duplicate_table THEN NULL;
        END $$;
      `);
      console.log('✅ Customer DB ready');
      return;
    } catch (err) {
      console.error(`❌ DB not ready (attempt ${attempt}/10): ${err.message}`);
      await delay(3000);
    }
  }
  process.exit(1);
}

// ── SEED ADMIN ────────────────────────────────────────────────────────────────
async function seedAdmin() {
  try {
    const existing = await pool.query('SELECT id FROM users WHERE email=$1', ['admin@nexflow.com']);
    if (existing.rows.length === 0) {
      const hash = await bcrypt.hash('admin123', 10);
      await pool.query(
        `INSERT INTO users(email, password_hash, role) VALUES($1,$2,'admin')`,
        ['admin@nexflow.com', hash]
      );
      console.log('✅ Admin user seeded: admin@nexflow.com / admin123');
    }
  } catch (err) {
    console.error('⚠️ Admin seed error:', err.message);
  }
}

// ── SEED SIMULATOR USER ───────────────────────────────────────────────────────
async function seedSimulatorUser() {
  try {
    const existing = await pool.query('SELECT id FROM users WHERE email=$1', ['sim@nexflow.internal']);
    if (existing.rows.length === 0) {
      const hash = await bcrypt.hash('sim_password_123', 10);
      await pool.query(
        `INSERT INTO users(email, password_hash, role) VALUES($1,$2,'carrier')`,
        ['sim@nexflow.internal', hash]
      );
      console.log('✅ Simulator user seeded');
    }
  } catch (err) {
    console.error('⚠️ Simulator seed skipped:', err.message);
  }
}

// ── REGISTER ──────────────────────────────────────────────────────────────────
app.post('/customers/register', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role)
    return res.status(400).json({ error: 'email, password and role are required' });
  if (!['shipper', 'carrier'].includes(role))
    return res.status(400).json({ error: 'role must be shipper or carrier' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users(email, password_hash, role) VALUES($1,$2,$3) RETURNING id,email,role`,
      [email.toLowerCase(), hash, role]
    );
    const newUser = result.rows[0];

    // Publish welcome event to notification service
    await publishEvent('user.registered', {
      user_id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    res.status(201).json(newUser);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// ── GOOGLE AUTH ───────────────────────────────────────────────────────────────
// POST /customers/auth/google
// Body: { credential: "<Google access token>", role: "shipper"|"carrier" }
//
// Flow:
//   1. Exchange the Google access token for user info via Google's userinfo endpoint.
//   2. If the user already exists (matched by google_id or email) → sign them in.
//   3. If not → create a new account with the role supplied by the client,
//      then fire a user.registered welcome event.
app.post('/customers/auth/google', async (req, res) => {
  const { credential, role } = req.body;

  if (!credential) {
    return res.status(400).json({ error: 'Google credential is required' });
  }

  // Verify the access token by calling Google's userinfo endpoint (built-in https)
  let googleUser;
  try {
    googleUser = await new Promise((resolve, reject) => {
      const https = require('https');
      const req = https.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { headers: { Authorization: `Bearer ${credential}` } },
        (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            if (res.statusCode !== 200) {
              reject(new Error(`Google userinfo returned ${res.statusCode}`));
            } else {
              try { resolve(JSON.parse(data)); }
              catch (e) { reject(new Error('Invalid JSON from Google')); }
            }
          });
        }
      );
      req.on('error', reject);
      req.end();
    });
  } catch (err) {
    console.error('Google token verification failed:', err.message);
    return res.status(401).json({ error: 'Invalid Google token' });
  }

  const { sub: googleId, email, name, picture: avatar } = googleUser;

  try {
    // Check if user exists by google_id or email
    let result = await pool.query(
      'SELECT id, email, role, name, avatar FROM users WHERE google_id=$1 OR email=$2',
      [googleId, email.toLowerCase()]
    );

    let user;
    let isNewUser = false;

    if (result.rows.length > 0) {
      user = result.rows[0];
      // Update google_id / avatar if this is the first Google sign-in for an existing email account
      await pool.query(
        'UPDATE users SET google_id=$1, avatar=$2, name=COALESCE(name,$3) WHERE id=$4',
        [googleId, avatar, name, user.id]
      );
    } else {
      // New user — require a role from the client (sent from the sign-up form)
      const assignedRole = ['shipper', 'carrier'].includes(role) ? role : 'shipper';
      const insertResult = await pool.query(
        `INSERT INTO users(email, google_id, role, name, avatar)
         VALUES($1,$2,$3,$4,$5)
         RETURNING id, email, role, name, avatar`,
        [email.toLowerCase(), googleId, assignedRole, name, avatar]
      );
      user = insertResult.rows[0];
      isNewUser = true;

      // Send welcome notification for new Google sign-ups
      await publishEvent('user.registered', {
        user_id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role, name: user.name, avatar: user.avatar },
      isNewUser,
    });
  } catch (err) {
    console.error('Google auth DB error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── LOGIN ─────────────────────────────────────────────────────────────────────
app.post('/customers/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'email and password are required' });
  try {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email.toLowerCase()]);
    if (result.rows.length === 0)
      return res.status(401).json({ error: 'Invalid credentials' });
    const user = result.rows[0];

    // Google-only accounts have no password_hash
    if (!user.password_hash) {
      return res.status(401).json({ error: 'This account uses Google Sign-In. Please use the Google button.' });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PROFILE ───────────────────────────────────────────────────────────────────
app.get('/customers/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const result = await pool.query(
      'SELECT id, email, role, name, avatar, created_at FROM users WHERE id=$1',
      [decoded.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// ── ADMIN: GET ALL USERS ──────────────────────────────────────────────────────
app.get('/customers/admin/users', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const result = await pool.query(
      'SELECT id, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ users: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ADMIN: DELETE USER ────────────────────────────────────────────────────────
app.delete('/customers/admin/users/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    await pool.query('DELETE FROM users WHERE id=$1 AND role != $2', [req.params.id, 'admin']);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ADMIN: STATS ──────────────────────────────────────────────────────────────
app.get('/customers/admin/stats', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin only' });

    const totals = await pool.query(`
      SELECT
        COUNT(*)                                                          AS total_users,
        COUNT(*) FILTER (WHERE role = 'shipper')                         AS total_shippers,
        COUNT(*) FILTER (WHERE role = 'carrier')                         AS total_carriers,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') AS new_this_week
      FROM users
    `);

    res.json({ stats: totals.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── HEALTH ────────────────────────────────────────────────────────────────────
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'healthy', service: 'customer-service', database: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'unhealthy', error: err.message });
  }
});

async function start() {
  await initDB();
  await seedAdmin();
  await seedSimulatorUser();
  await connectRabbitMQ();
  app.listen(PORT, () => console.log(`🚀 Customer Service running on port ${PORT}`));
}

start();
process.on('SIGTERM', async () => { await pool.end(); process.exit(0); });
