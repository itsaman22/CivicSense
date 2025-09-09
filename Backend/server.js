// 🚀 CivicSense API Server - MongoDB Atlas Version
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

// Import database connection
const connectDatabase = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// 📡 Connect to MongoDB Atlas
connectDatabase();

// Middleware
app.use(cors());
app.use(express.json()); // To read JSON data from requests

// Import simple routes
const authRoutes = require('./routes/auth');
const issueRoutes = require('./routes/issues');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const adminRoutes = require('./routes/admin');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);

// Home route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to CivicSense API!',
    version: '1.0.0 - Simple Version',
    available_routes: [
      'GET  / - This welcome message',
      'POST /api/auth/register - Register new user',
      'POST /api/auth/login - Login user',
      'GET  /api/issues - Get all issues',
      'POST /api/issues - Create new issue',
      'GET  /api/categories - Get all categories',
      'GET  /api/users - Get all users',
      'GET  /api/admin/dashboard - Admin dashboard'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CivicSense Server is running!`);
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log(`🔍 Test the API by visiting: http://localhost:${PORT}`);
  console.log(`\n📋 Available test accounts:`);
  console.log(`   Admin: admin@civic.com / admin123`);
  console.log(`   User:  user@civic.com / user123`);
});

module.exports = app;
