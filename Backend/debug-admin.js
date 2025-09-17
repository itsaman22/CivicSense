// Debug script to check admin user data
const mongoose = require('mongoose');
const User = require('./models/User');

require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Find admin users
    const adminUsers = await User.find({ userType: 'admin' });
    console.log('\n📊 Admin Users Found:', adminUsers.length);
    
    adminUsers.forEach((admin, index) => {
      console.log(`\n👨‍💼 Admin ${index + 1}:`);
      console.log('Name:', admin.name);
      console.log('Email:', admin.email);
      console.log('Department:', admin.department);
      console.log('Designation:', admin.designation);
      console.log('AdminJurisdiction:', JSON.stringify(admin.adminJurisdiction, null, 2));
      console.log('Location (old field):', JSON.stringify(admin.location, null, 2));
    });
    
    mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

connectDB();