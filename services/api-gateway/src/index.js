require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');

const app = express();


// CORS — allow frontend on port 3000
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// DO NOT use express.json() here — it consumes the body before the proxy can forward it

const JWT_SECRET = process.env.JWT_SECRET || 'nexflow_secret_key';

const CUSTOMER_SERVICE     = process.env.CUSTOMER_SERVICE_URL     || 'http://customer-service:3001';
const RESOURCE_SERVICE     = process.env.RESOURCE_SERVICE_URL     || 'http://resource-service:3002';
const BOOKING_SERVICE      = process.env.BOOKING_SERVICE_URL      || 'http://booking-service:3003';
const PAYMENT_SERVICE      = process.env.PAYMENT_SERVICE_URL      || 'http://payment-service:3004';
const NOTIFICATION_SERVICE = process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3005';
const TRACKING_SERVICE     = process.env.TRACKING_SERVICE_URL     || 'http://tracking-service:3006';

// ================= ERROR HANDLER FOR PROXY =================
function onProxyError(err, req, res) {
  console.error('[Proxy Error]', err.message);
  res.status(502).json({ error: 'Service unavailable', details: err.message });
}

// ================= HEALTH =================
app.get('/health', (req, res) => {
  res.json({ status: 'gateway-ok', timestamp: new Date().toISOString() });
});

// ================= PUBLIC: REGISTER =================
app.use(
  '/api/customers/register',
  createProxyMiddleware({
    target: CUSTOMER_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/api/customers/register': '/customers/register' },
    on: { error: onProxyError }
  })
);

// ================= PUBLIC: LOGIN =================
app.use(
  '/api/customers/login',
  createProxyMiddleware({
    target: CUSTOMER_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/api/customers/login': '/customers/login' },
    on: { error: onProxyError }
  })
);

// ================= AUTH MIDDLEWARE =================
// Reads only the Authorization header — never touches the body
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
}

// ================= ADMIN STATS =================
app.use(
  '/api/customers/admin/stats',
  auth,
  createProxyMiddleware({
    target: CUSTOMER_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/api/customers/admin/stats': '/customers/admin/stats' },
    on: { error: onProxyError }
  })
);

// ================= CUSTOMER (protected) =================
app.use(
  '/api/customers',
  auth,
  createProxyMiddleware({
    target: CUSTOMER_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/api/customers': '/customers' },
    on: { error: onProxyError }
  })
);

// ================= RESOURCE SERVICE =================
app.use(
  '/api/resources',
  auth,
  createProxyMiddleware({
    target: RESOURCE_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/api/resources': '/api/resources' },
    on: { error: onProxyError }
  })
);

// ================= BOOKING SERVICE =================
app.use(
  '/api/bookings',
  auth,
  createProxyMiddleware({
    target: BOOKING_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/api/bookings': '/api/bookings' },
    on: { error: onProxyError }
  })
);

// ================= PAYMENT SERVICE =================
app.use(
  '/api/payments',
  auth,
  createProxyMiddleware({
    target: PAYMENT_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/api/payments': '/api/payments' },
    on: { error: onProxyError }
  })
);

// ================= NOTIFICATION SERVICE =================
app.use(
  '/api/notifications',
  auth,
  createProxyMiddleware({
    target: NOTIFICATION_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/api/notifications': '/api/notifications' },
    on: { error: onProxyError }
  })
);

// ================= TRACKING SERVICE =================
app.use(
  '/api/tracking',
  auth,
  createProxyMiddleware({
    target: TRACKING_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/api/tracking': '/api/tracking' },
    on: { error: onProxyError }
  })
);

// ================= 404 FALLBACK =================
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(8080, () => {
  console.log('API Gateway running on 8080');
});