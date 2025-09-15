// Debug script to check regular user location data
const mongoose = require('mongoose');
const User = require('./models/User');

require('dotenv').config();

const checkUserLocations = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Find regular users
    const regularUsers = await User.find({ userType: 'user' });
    console.log('\n📊 Regular Users Found:', regularUsers.length);
    
    regularUsers.forEach((user, index) => {
      console.log(`\n👤 User ${index + 1}:`);
      console.log('Name:', user.name);
      console.log('Email:', user.email);
      console.log('Location:', JSON.stringify(user.location, null, 2));
    });
    
    mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

checkUserLocations();