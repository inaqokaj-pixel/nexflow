require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');
const amqp = require('amqplib');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3005;

// ============ DATABASE CONNECTION ============
const pool = new Pool({
  host: process.env.DB_HOST || 'postgres-notification',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'notification_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123',
});

// ============ DATABASE INITIALIZATION ============
async function initDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      type VARCHAR(50),
      subject VARCHAR(255),
      message TEXT NOT NULL,
      status VARCHAR(50) DEFAULT 'pending' CHECK (
        status IN ('pending', 'sent', 'failed', 'read')
      ),
      metadata JSONB,
      sent_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
  `;

  const delay = ms => new Promise(r => setTimeout(r, ms));
  for (let attempt = 1; attempt <= 10; attempt++) {
    try {
      await pool.query(createTableQuery);
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
async function saveNotification(userId, type, subject, message, metadata) {
  try {
    const result = await pool.query(
      `INSERT INTO notifications (user_id, type, subject, message, metadata, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, type, subject, message, JSON.stringify(metadata), 'pending']
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error saving notification:', error);
    return null;
  }
}

async function updateNotificationStatus(notificationId, status) {
  try {
    await pool.query(
      `UPDATE notifications
       SET status = $1, sent_at = NOW()
       WHERE id = $2`,
      [status, notificationId]
    );
  } catch (error) {
    console.error('Error updating notification status:', error);
  }
}

// Simulate sending email
async function sendEmail(to, subject, message) {
  await new Promise(resolve => setTimeout(resolve, 500));

  console.log(`📧 EMAIL SENT`);
  console.log(`   To: ${to}`);
  console.log(`   Subject: ${subject}`);
  console.log(`   Message: ${message.substring(0, 100)}...`);

  // Simulate 98% success rate
  return Math.random() > 0.02;
}

// ============ EVENT HANDLERS ============
async function handleBookingCreatedEvent(eventData) {
  console.log('📨 Handling booking.created event:', eventData.data.booking_id);

  const { shipper_id, booking_id, pickup_date, delivery_location, total_cost } = eventData.data;

  const deliveryCity = delivery_location?.city || 'N/A';
  const deliveryCountry = delivery_location?.country || 'N/A';
  const pickupDateStr = pickup_date ? new Date(pickup_date).toLocaleDateString() : 'N/A';

  const subject = 'Booking Confirmation - NexFlow';
  const message = `
Your Shipment Booking is Confirmed!

Booking ID: ${booking_id}
Pickup Date: ${pickupDateStr}
Delivery Location: ${deliveryCity}, ${deliveryCountry}
Total Cost: $${total_cost}

Thank you for choosing NexFlow!
  `;

  const notification = await saveNotification(
    shipper_id,
    'email',
    subject,
    message,
    { booking_id, event_type: 'booking.created' }
  );

  const emailSent = await sendEmail(
    `user-${shipper_id}@nexflow.com`,
    subject,
    message
  );

  if (notification) {
    await updateNotificationStatus(
      notification.id,
      emailSent ? 'sent' : 'failed'
    );
  }
}

async function handleBookingStatusChangedEvent(eventData) {
  console.log('📨 Handling booking.status_changed event');

  const { shipper_id, booking_id, new_status } = eventData.data;

  if (!shipper_id) {
    console.warn('⚠️ booking.status_changed event missing shipper_id, skipping notification');
    return;
  }

  const statusMessages = {
    confirmed: 'Your booking has been confirmed by the carrier',
    in_transit: 'Your shipment is now in transit',
    delivered: 'Your shipment has been delivered successfully',
    cancelled: 'Your booking has been cancelled'
  };

  const subject = `Booking Update - ${new_status.toUpperCase()}`;
  const message = `
Booking Status Update

Booking ID: ${booking_id}
${statusMessages[new_status] || 'Your booking status has been updated.'}

Current Status: ${new_status}
  `;

  const notification = await saveNotification(
    shipper_id,
    'email',
    subject,
    message,
    { booking_id, event_type: 'booking.status_changed' }
  );

  const emailSent = await sendEmail(
    `user-${shipper_id}@nexflow.com`,
    subject,
    message
  );

  if (notification) {
    await updateNotificationStatus(
      notification.id,
      emailSent ? 'sent' : 'failed'
    );
  }
}

async function handleBookingCancelledEvent(eventData) {
  console.log('📨 Handling booking.cancelled event');

  const { booking_id, shipper_id } = eventData.data;

  if (!shipper_id) {
    console.warn('⚠️ booking.cancelled event missing shipper_id, skipping notification');
    return;
  }

  const subject = 'Booking Cancelled - NexFlow';
  const message = `
Booking Cancellation Confirmed

Booking ID: ${booking_id}
Your booking has been successfully cancelled.

If you did not request this cancellation, please contact support immediately.

Thank you for using NexFlow.
  `;

  const notification = await saveNotification(
    shipper_id,
    'email',
    subject,
    message,
    { booking_id, event_type: 'booking.cancelled' }
  );

  const emailSent = await sendEmail(
    `user-${shipper_id}@nexflow.com`,
    subject,
    message
  );

  if (notification) {
    await updateNotificationStatus(
      notification.id,
      emailSent ? 'sent' : 'failed'
    );
  }
}

async function handlePaymentCompletedEvent(eventData) {
  console.log('📨 Handling payment.completed event');

  const { user_id, booking_id, amount, transaction_id } = eventData.data;

  const subject = 'Payment Confirmation - NexFlow';
  const message = `
Payment Received

Your payment has been processed successfully.

Transaction ID: ${transaction_id}
Booking ID: ${booking_id}
Amount: $${amount}

Thank you for your payment!
  `;

  const notification = await saveNotification(
    user_id,
    'email',
    subject,
    message,
    { booking_id, transaction_id, event_type: 'payment.completed' }
  );

  const emailSent = await sendEmail(
    `user-${user_id}@nexflow.com`,
    subject,
    message
  );

  if (notification) {
    await updateNotificationStatus(
      notification.id,
      emailSent ? 'sent' : 'failed'
    );
  }
}

async function handleUserRegisteredEvent(eventData) {
  console.log('📨 Handling user.registered event');

  const { user_id, email, role } = eventData.data;

  const subject = 'Welcome to NexFlow!';
  const message = `
Welcome to NexFlow!

Thank you for registering as a ${role}.

Your account has been created successfully.
Email: ${email}

Start managing your logistics today!
  `;

  const notification = await saveNotification(
    user_id,
    'email',
    subject,
    message,
    { event_type: 'user.registered' }
  );

  const emailSent = await sendEmail(
    email,
    subject,
    message
  );

  if (notification) {
    await updateNotificationStatus(
      notification.id,
      emailSent ? 'sent' : 'failed'
    );
  }
}

// ============ RABBITMQ EVENT LISTENER ============
async function startEventListener() {
  try {
    const connection = await amqp.connect(
      process.env.RABBITMQ_URL || 'amqp://admin:admin123@rabbitmq:5672'
    );
    const channel = await connection.createChannel();

    await channel.assertExchange('nexflow_events', 'topic', { durable: true });

    const queue = await channel.assertQueue('notification_service_queue', {
      durable: true
    });

    await channel.bindQueue(queue.queue, 'nexflow_events', 'booking.created');
    await channel.bindQueue(queue.queue, 'nexflow_events', 'booking.status_changed');
    await channel.bindQueue(queue.queue, 'nexflow_events', 'booking.cancelled');
    await channel.bindQueue(queue.queue, 'nexflow_events', 'payment.completed');
    await channel.bindQueue(queue.queue, 'nexflow_events', 'payment.failed');
    await channel.bindQueue(queue.queue, 'nexflow_events', 'user.registered');

    console.log('✅ Connected to RabbitMQ - Listening for events...');

    channel.consume(queue.queue, async (msg) => {
      if (msg !== null) {
        const eventData = JSON.parse(msg.content.toString());

        console.log(`📥 Received event: ${eventData.event_type}`);

        try {
          switch (eventData.event_type) {
            case 'booking.created':
              await handleBookingCreatedEvent(eventData);
              break;
            case 'booking.status_changed':
              await handleBookingStatusChangedEvent(eventData);
              break;
            case 'booking.cancelled':
              await handleBookingCancelledEvent(eventData);
              break;
            case 'payment.completed':
              await handlePaymentCompletedEvent(eventData);
              break;
            case 'user.registered':
              await handleUserRegisteredEvent(eventData);
              break;
            default:
              console.log(`⚠️ Unknown event type: ${eventData.event_type}`);
          }

          channel.ack(msg);
        } catch (error) {
          console.error('❌ Error processing event:', error);
          channel.nack(msg, false, true);
        }
      }
    });

  } catch (error) {
    console.error('❌ RabbitMQ connection failed:', error);
    setTimeout(startEventListener, 5000);
  }
}

// ============ API ENDPOINTS ============

// GET USER NOTIFICATIONS
app.get('/api/notifications/user/:userId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [req.params.userId]
    );

    res.json({ notifications: result.rows });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// MARK NOTIFICATION AS READ
app.put('/api/notifications/:id/read', async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE notifications
       SET status = 'read'
       WHERE id = $1
       RETURNING *`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ notification: result.rows[0] });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// HEALTH CHECK
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'healthy',
      service: 'notification-service',
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
  await startEventListener();

  app.listen(PORT, () => {
    console.log(`🚀 Notification Service running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await pool.end();
  process.exit(0);
});
