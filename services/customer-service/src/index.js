require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

// ── DB INIT ──────────────────────────────────────────────────────────────────
async function initDB() {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  for (let attempt = 1; attempt <= 10; attempt++) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT NOT NULL CHECK (role IN ('shipper','carrier','admin')),
          created_at TIMESTAMP DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID UNIQUE REFERENCES users(id),
          company_name TEXT,
          contact_phone TEXT,
          address TEXT
        );
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
    res.status(201).json(result.rows[0]);
  } catch (e) {
    res.status(400).json({ error: e.message });
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
      'SELECT id, email, role, created_at FROM users WHERE id=$1',
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
  app.listen(PORT, () => console.log(`🚀 Customer Service running on port ${PORT}`));
}

start();
process.on('SIGTERM', async () => { await pool.end(); process.exit(0); });
