const express = require('express');
const mongoose = require('mongoose');
const amqp = require('amqplib');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/resource_db';

// ============ MONGODB CONNECTION ============
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection failed:', err);
  process.exit(1);
});

// ============ MONGOOSE SCHEMAS ============

// Fleet Schema
const fleetSchema = new mongoose.Schema({
  carrier_id: { type: String, required: true, index: true },
  vehicle_type: { 
    type: String, 
    required: true,
    enum: ['truck', 'van', 'semi_truck', 'container', 'cargo_plane', 'motorcycle', 'ship', 'train']
  },
  capacity: {
    weight_kg: { type: Number, required: true, min: 0 },
    volume_m3: { type: Number, required: true, min: 0 }
  },
  current_location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
    address: String,
    city: String,
    country: String
  },
  availability: {
    status: { 
      type: String, 
      enum: ['available', 'reserved', 'in_transit', 'maintenance'],
      default: 'available'
    },
    available_from: Date,
    reserved_until: Date
  },
  specifications: {
    refrigerated: { type: Boolean, default: false },
    hazmat_certified: { type: Boolean, default: false },
    license_plate: String,
    year: Number,
    make: String,
    model: String
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Geospatial index for location-based queries
fleetSchema.index({ 'current_location': '2dsphere' });

const Fleet = mongoose.model('Fleet', fleetSchema);

// Route Schema
const routeSchema = new mongoose.Schema({
  carrier_id: { type: String, required: true, index: true },
  origin: {
    city: { type: String, required: true },
    country: { type: String, required: true },
    coordinates: [Number] // [longitude, latitude]
  },
  destination: {
    city: { type: String, required: true },
    country: { type: String, required: true },
    coordinates: [Number]
  },
  estimated_duration_hours: { type: Number, required: true },
  cost_per_kg: { type: Number, required: true, min: 0 },
  active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

routeSchema.index({ 'origin.city': 1, 'destination.city': 1 });

const Route = mongoose.model('Route', routeSchema);

// ============ RABBITMQ CONNECTION ============
let channel;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(
      process.env.RABBITMQ_URL || 'amqp://localhost:5672'
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

// ============ API ENDPOINTS ============

// 1. ADD FLEET VEHICLE
app.post('/api/resources/fleet', async (req, res) => {
  const {
    carrier_id,
    vehicle_type,
    capacity,
    current_location,
    specifications
  } = req.body;
  
  // Validation
  if (!carrier_id || !vehicle_type || !capacity) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['carrier_id', 'vehicle_type', 'capacity']
    });
  }
  
  if (!capacity.weight_kg || !capacity.volume_m3) {
    return res.status(400).json({
      error: 'Capacity must include weight_kg and volume_m3'
    });
  }
  
  try {
    const vehicle = new Fleet({
      carrier_id,
      vehicle_type,
      capacity,
      current_location: {
        type: 'Point',
        coordinates: current_location?.coordinates || [0, 0],
        address: current_location?.address,
        city: current_location?.city,
        country: current_location?.country
      },
      specifications: specifications || {},
      availability: {
        status: 'available',
        available_from: new Date()
      }
    });
    
    await vehicle.save();
    
    // Publish event
    await publishEvent('resource.fleet_added', {
      vehicle_id: vehicle._id.toString(),
      carrier_id: carrier_id,
      vehicle_type: vehicle_type
    });
    
    res.status(201).json({
      success: true,
      vehicle: vehicle
    });
    
  } catch (error) {
    console.error('Error adding fleet vehicle:', error);
    res.status(500).json({ error: 'Failed to add vehicle' });
  }
});

// 2. LIST AVAILABLE VEHICLES
app.get('/api/resources/fleet/available', async (req, res) => {
  const { 
    vehicle_type, 
    min_capacity_kg,
    city,
    page = 1,
    limit = 20
  } = req.query;
  
  try {
    let query = { 'availability.status': 'available' };
    
    // Filter by vehicle type
    if (vehicle_type) {
      query.vehicle_type = vehicle_type;
    }
    
    // Filter by capacity
    if (min_capacity_kg) {
      query['capacity.weight_kg'] = { $gte: parseFloat(min_capacity_kg) };
    }
    
    // Filter by city
    if (city) {
      query['current_location.city'] = new RegExp(city, 'i');
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const vehicles = await Fleet.find(query)
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ created_at: -1 });
    
    const total = await Fleet.countDocuments(query);
    
    res.json({
      vehicles: vehicles,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / parseInt(limit)),
        total_vehicles: total,
        per_page: parseInt(limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// 3. GET VEHICLE DETAILS
app.get('/api/resources/fleet/:id', async (req, res) => {
  try {
    const vehicle = await Fleet.findById(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    res.json({ vehicle: vehicle });
    
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({ error: 'Failed to fetch vehicle' });
  }
});

// 4. UPDATE VEHICLE AVAILABILITY
app.put('/api/resources/fleet/:id/availability', async (req, res) => {
  const { status, reserved_until } = req.body;
  
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }
  
  if (!['available', 'reserved', 'in_transit', 'maintenance'].includes(status)) {
    return res.status(400).json({ 
      error: 'Invalid status',
      allowed: ['available', 'reserved', 'in_transit', 'maintenance']
    });
  }
  
  try {
    const updateData = {
      'availability.status': status,
      updated_at: new Date()
    };
    
    if (reserved_until) {
      updateData['availability.reserved_until'] = new Date(reserved_until);
    }
    
    const vehicle = await Fleet.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );
    
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    // Publish event
    await publishEvent('resource.availability_updated', {
      vehicle_id: vehicle._id.toString(),
      status: status,
      carrier_id: vehicle.carrier_id
    });
    
    res.json({
      success: true,
      message: 'Availability updated',
      vehicle: vehicle
    });
    
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ error: 'Failed to update availability' });
  }
});

// 5. ADD ROUTE
app.post('/api/resources/routes', async (req, res) => {
  const {
    carrier_id,
    origin,
    destination,
    estimated_duration_hours,
    cost_per_kg
  } = req.body;
  
  if (!carrier_id || !origin || !destination || !estimated_duration_hours || !cost_per_kg) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['carrier_id', 'origin', 'destination', 'estimated_duration_hours', 'cost_per_kg']
    });
  }
  
  try {
    const route = new Route({
      carrier_id,
      origin,
      destination,
      estimated_duration_hours,
      cost_per_kg,
      active: true
    });
    
    await route.save();
    
    // Publish event
    await publishEvent('resource.route_added', {
      route_id: route._id.toString(),
      carrier_id: carrier_id,
      origin: origin.city,
      destination: destination.city
    });
    
    res.status(201).json({
      success: true,
      route: route
    });
    
  } catch (error) {
    console.error('Error adding route:', error);
    res.status(500).json({ error: 'Failed to add route' });
  }
});

// 6. SEARCH ROUTES
app.get('/api/resources/routes', async (req, res) => {
  const { 
    origin_city, 
    destination_city,
    page = 1,
    limit = 20
  } = req.query;
  
  try {
    let query = {};
    
    if (origin_city) {
      query['origin.city'] = new RegExp(origin_city, 'i');
    }
    if (destination_city) {
      query['destination.city'] = new RegExp(destination_city, 'i');
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const routes = await Route.find(query)
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ cost_per_kg: 1 }); // Sort by cheapest first
    
    const total = await Route.countDocuments(query);
    
    res.json({
      routes: routes,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / parseInt(limit)),
        total_routes: total
      }
    });
    
  } catch (error) {
    console.error('Error searching routes:', error);
    res.status(500).json({ error: 'Failed to search routes' });
  }
});

// 7. GET ROUTE DETAILS
app.get('/api/resources/routes/:id', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }
    
    res.json({ route: route });
    
  } catch (error) {
    console.error('Error fetching route:', error);
    res.status(500).json({ error: 'Failed to fetch route' });
  }
});

// HEALTH CHECK
app.get('/health', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ 
      status: 'healthy',
      service: 'resource-service',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message
    });
  }
});

// ============ START SERVER ============
async function startServer() {
  await connectRabbitMQ();
  
  app.listen(PORT, () => {
    console.log(`🚀 Resource Service running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await mongoose.connection.close();
  process.exit(0);
});