require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// ================= DB =================
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'customer_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123',
});

const JWT_SECRET = process.env.JWT_SECRET || 'nexflow_secret_key';
const PORT = process.env.PORT || 3001;

// ================= INIT DB (with retry) =================
async function initDB() {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  for (let attempt = 1; attempt <= 10; attempt++) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT NOT NULL,
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
  console.error('❌ Could not connect to DB after 10 attempts, exiting');
  process.exit(1);
}

// ================= REGISTER =================
app.post('/customers/register', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role)
    return res.status(400).json({ error: 'email, password and role are required' });

  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users(email, password_hash, role)
       VALUES($1,$2,$3)
       RETURNING id,email,role`,
      [email.toLowerCase(), hash, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// ================= LOGIN =================
app.post('/customers/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'email and password are required' });

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email=$1',
      [email.toLowerCase()]
    );
    if (result.rows.length === 0)
      return res.status(401).json({ error: 'Invalid credentials' });

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok)
      return res.status(401).json({ error: 'Invalid credentials' });

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

// ================= PROFILE =================
app.get('/customers/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token' });
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const result = await pool.query(
      'SELECT id, email, role, created_at FROM users WHERE id=$1',
      [decoded.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'User not found' });
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// ================= HEALTH =================
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'healthy', service: 'customer-service', database: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'unhealthy', error: err.message });
  }
});

// ================= START =================
async function start() {
  await initDB();
  app.listen(PORT, () => {
    console.log(`🚀 Customer Service running on port ${PORT}`);
  });
}

start();

process.on('SIGTERM', async () => {
  await pool.end();
  process.exit(0);
});
