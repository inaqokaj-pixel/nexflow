const express = require('express');
const { Pool } = require('pg');
const amqp = require('amqplib');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3004;

// ============ DATABASE CONNECTION ============
const pool = new Pool({
  host: process.env.DB_HOST || 'postgres-payment',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'payment_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123',
  max: 20,
  idleTimeoutMillis: 30000,
});

// ============ RABBITMQ CONNECTION ============
let channel;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(
      process.env.RABBITMQ_URL || 'amqp://admin:admin123@rabbitmq:5672'
    );
    channel = await connection.createChannel();
    await channel.assertExchange('nexflow_events', 'topic', { durable: true });
    console.log('✅ Connected to RabbitMQ');
  } catch (error) {
    console.error('❌ RabbitMQ connection failed:', error);
    setTimeout(connectRabbitMQ, 5000);
  }
}

async function publishEvent(eventType, data) {
  if (!channel) {
    console.error('❌ RabbitMQ channel not available');
    return;
  }
  const event = {
    event_type: eventType,
    data: data,
    timestamp: new Date().toISOString()
  };
  channel.publish('nexflow_events', eventType, Buffer.from(JSON.stringify(event)));
  console.log(`📤 Event published: ${eventType}`);
}

// ============ DATABASE INITIALIZATION ============
async function initDatabase() {
  const createTablesQuery = `
    CREATE TABLE IF NOT EXISTS payments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      booking_id UUID NOT NULL,
      user_id UUID NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      currency VARCHAR(10) DEFAULT 'USD',
      
      payment_method VARCHAR(50),
      payment_status VARCHAR(50) DEFAULT 'pending' CHECK (
        payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')
      ),
      
      transaction_id VARCHAR(255) UNIQUE,
      card_last_four VARCHAR(4),
      
      created_at TIMESTAMP DEFAULT NOW(),
      processed_at TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      payment_id UUID REFERENCES payments(id),
      invoice_number VARCHAR(50) UNIQUE,
      invoice_url TEXT,
      generated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS refunds (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      payment_id UUID REFERENCES payments(id),
      refund_amount DECIMAL(10,2) NOT NULL,
      reason TEXT,
      refund_status VARCHAR(50) DEFAULT 'processing' CHECK (
        refund_status IN ('processing', 'completed', 'failed')
      ),
      refund_transaction_id VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW(),
      completed_at TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
    CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
    CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(payment_status);
  `;
  
  const delay = ms => new Promise(r => setTimeout(r, ms));
  for (let attempt = 1; attempt <= 10; attempt++) {
    try {
      await pool.query(createTablesQuery);
      console.log('✅ Database initialized');
      return;
    } catch (error) {
      console.error(`❌ Database init failed (attempt ${attempt}/10):`, error.message);
      await delay(3000);
    }
  }
  console.error('❌ Could not connect to DB after 10 attempts, exiting');
  process.exit(1);
}

// ============ HELPER FUNCTIONS ============
function generateTransactionId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `txn_${timestamp}_${random}`;
}

function generateInvoiceNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `INV-${year}${month}-${random}`;
}

// Simulate payment processing
async function processPaymentGateway(paymentData) {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate 95% success rate
  const success = Math.random() > 0.05;
  
  if (success) {
    return {
      success: true,
      transaction_id: generateTransactionId(),
      processed_at: new Date()
    };
  } else {
    return {
      success: false,
      error: 'Payment declined by issuing bank'
    };
  }
}

// ============ API ENDPOINTS ============

// 1. PROCESS PAYMENT
app.post('/api/payments/process', async (req, res) => {
  const {
    booking_id,
    user_id,
    amount,
    currency = 'USD',
    payment_method,
    card_details
  } = req.body;
  
  // Validation
  if (!booking_id || !user_id || !amount) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['booking_id', 'user_id', 'amount']
    });
  }
  
  if (amount <= 0) {
    return res.status(400).json({ error: 'Amount must be greater than 0' });
  }
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Check if payment already exists
    const existingPayment = await client.query(
      'SELECT id, payment_status FROM payments WHERE booking_id = $1',
      [booking_id]
    );
    
    if (existingPayment.rows.length > 0) {
      const existing = existingPayment.rows[0];
      if (existing.payment_status === 'completed') {
        await client.query('ROLLBACK');
        return res.status(409).json({ 
          error: 'Payment already processed for this booking',
          payment_id: existing.id
        });
      }
    }
    
    // Get last 4 digits of card
    const cardLastFour = card_details?.card_number ? 
      card_details.card_number.slice(-4) : null;
    
    // Create payment record
    const paymentResult = await client.query(
      `INSERT INTO payments (
        booking_id, user_id, amount, currency, 
        payment_method, payment_status, card_last_four
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        booking_id, 
        user_id, 
        amount, 
        currency,
        payment_method || 'credit_card',
        'processing',
        cardLastFour
      ]
    );
    
    const payment = paymentResult.rows[0];
    
    // Process payment through gateway
    console.log(`💳 Processing payment for booking ${booking_id}...`);
    const gatewayResult = await processPaymentGateway({
      amount,
      currency,
      card_details
    });
    
    if (gatewayResult.success) {
      // Update payment as completed
      await client.query(
        `UPDATE payments 
         SET payment_status = 'completed',
             transaction_id = $1,
             processed_at = NOW()
         WHERE id = $2`,
        [gatewayResult.transaction_id, payment.id]
      );
      
      // Generate invoice
      const invoiceNumber = generateInvoiceNumber();
      await client.query(
        `INSERT INTO invoices (payment_id, invoice_number)
         VALUES ($1, $2)`,
        [payment.id, invoiceNumber]
      );
      
      await client.query('COMMIT');
      
      // Publish success event
      await publishEvent('payment.completed', {
        payment_id: payment.id,
        booking_id: booking_id,
        user_id: user_id,
        amount: amount,
        transaction_id: gatewayResult.transaction_id
      });
      
      console.log(`✅ Payment completed: ${gatewayResult.transaction_id}`);
      
      res.json({
        success: true,
        payment: {
          id: payment.id,
          booking_id: booking_id,
          amount: amount,
          currency: currency,
          payment_status: 'completed',
          transaction_id: gatewayResult.transaction_id,
          invoice_number: invoiceNumber,
          processed_at: gatewayResult.processed_at
        }
      });
      
    } else {
      // Payment failed
      await client.query(
        `UPDATE payments 
         SET payment_status = 'failed'
         WHERE id = $1`,
        [payment.id]
      );
      
      await client.query('COMMIT');
      
      // Publish failure event
      await publishEvent('payment.failed', {
        payment_id: payment.id,
        booking_id: booking_id,
        user_id: user_id,
        error: gatewayResult.error
      });
      
      console.log(`❌ Payment failed: ${gatewayResult.error}`);
      
      res.status(402).json({
        success: false,
        error: gatewayResult.error,
        payment_id: payment.id
      });
    }
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Payment processing error:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  } finally {
    client.release();
  }
});

// 2. GET PAYMENT DETAILS
app.get('/api/payments/:id', async (req, res) => {
  try {
    const paymentResult = await pool.query(
      'SELECT * FROM payments WHERE id = $1',
      [req.params.id]
    );
    
    if (paymentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    const payment = paymentResult.rows[0];
    
    // Get invoice if exists
    const invoiceResult = await pool.query(
      'SELECT * FROM invoices WHERE payment_id = $1',
      [payment.id]
    );
    
    res.json({
      payment: payment,
      invoice: invoiceResult.rows[0] || null
    });
    
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

// 3. GET PAYMENT BY BOOKING
app.get('/api/payments/booking/:bookingId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, i.invoice_number 
       FROM payments p
       LEFT JOIN invoices i ON i.payment_id = p.id
       WHERE p.booking_id = $1
       ORDER BY p.created_at DESC`,
      [req.params.bookingId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No payment found for this booking' });
    }
    
    res.json({ payment: result.rows[0] });
    
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

// 4. PROCESS REFUND
app.post('/api/payments/:id/refund', async (req, res) => {
  const { reason, refund_amount } = req.body;
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Get payment
    const paymentResult = await client.query(
      'SELECT * FROM payments WHERE id = $1',
      [req.params.id]
    );
    
    if (paymentResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    const payment = paymentResult.rows[0];
    
    if (payment.payment_status !== 'completed') {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        error: 'Can only refund completed payments',
        current_status: payment.payment_status
      });
    }
    
    // Determine refund amount
    const amountToRefund = refund_amount || payment.amount;
    
    if (parseFloat(amountToRefund) > parseFloat(payment.amount)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        error: 'Refund amount cannot exceed payment amount',
        max_refund: payment.amount
      });
    }
    
    // Create refund record
    const refundTransactionId = generateTransactionId();
    const refundResult = await client.query(
      `INSERT INTO refunds (
        payment_id, refund_amount, reason, 
        refund_status, refund_transaction_id
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        payment.id,
        amountToRefund,
        reason || 'Customer requested refund',
        'processing',
        refundTransactionId
      ]
    );
    
    // Simulate refund processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update refund status
    await client.query(
      `UPDATE refunds 
       SET refund_status = 'completed', completed_at = NOW()
       WHERE id = $1`,
      [refundResult.rows[0].id]
    );
    
    // Update payment status
    await client.query(
      'UPDATE payments SET payment_status = $1 WHERE id = $2',
      ['refunded', payment.id]
    );
    
    await client.query('COMMIT');
    
    // Publish event
    await publishEvent('payment.refunded', {
      payment_id: payment.id,
      booking_id: payment.booking_id,
      user_id: payment.user_id,
      refund_amount: amountToRefund,
      refund_transaction_id: refundTransactionId
    });
    
    console.log(`✅ Refund processed: ${refundTransactionId}`);
    
    res.json({
      success: true,
      refund: {
        id: refundResult.rows[0].id,
        payment_id: payment.id,
        refund_amount: amountToRefund,
        refund_status: 'completed',
        refund_transaction_id: refundTransactionId,
        estimated_completion: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      }
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Refund processing error:', error);
    res.status(500).json({ error: 'Failed to process refund' });
  } finally {
    client.release();
  }
});

// HEALTH CHECK
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ 
      status: 'healthy',
      service: 'payment-service',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'unhealthy',
      error: error.message
    });
  }
});

// ============ START SERVER ============
async function startServer() {
  await initDatabase();
  await connectRabbitMQ();
  
  app.listen(PORT, () => {
    console.log(`🚀 Payment Service running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await pool.end();
  process.exit(0);
});