// 🧪 Simple Test Script for MongoDB Atlas Integration
// Run this to test if your database connection and models are working

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Issue = require('./models/Issue');

async function testDatabase() {
  try {
    console.log('🔍 Testing MongoDB Atlas Integration...\n');

    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB Atlas successfully!\n');

    // Test User model
    console.log('📊 Testing User Model...');
    const userCount = await User.countDocuments();
    console.log(`👥 Current users in database: ${userCount}`);

    // Test Issue model  
    console.log('\n📊 Testing Issue Model...');
    const issueCount = await Issue.countDocuments();
    console.log(`🏛️ Current issues in database: ${issueCount}`);

    // List collections
    console.log('\n📋 Available Collections:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });

    console.log('\n🎉 All tests passed! Your MongoDB Atlas setup is working perfectly!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔍 Troubleshooting:');
    console.log('1. Check your .env file has the correct MONGODB_URI');
    console.log('2. Verify your MongoDB Atlas user has proper permissions');
    console.log('3. Make sure your IP is whitelisted in Network Access');
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
    process.exit(0);
  }
}

// Run the test
testDatabase();
