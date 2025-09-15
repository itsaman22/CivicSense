// Script to update all admin users with jurisdiction data
const mongoose = require('mongoose');
const User = require('./models/User');

require('dotenv').config();

const updateAllAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Get all admin users without proper jurisdiction
    const adminsToUpdate = await User.find({ 
      userType: 'admin',
      $or: [
        { adminJurisdiction: { $exists: false } },
        { 'adminJurisdiction.city': { $exists: false } },
        { 'adminJurisdiction.coordinates': { $exists: false } }
      ]
    });
    
    console.log(`\n📊 Found ${adminsToUpdate.length} admins to update:`);
    
    const jurisdictionTemplates = [
      {
        address: 'Connaught Place, New Delhi',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
        coordinates: { latitude: 28.6315, longitude: 77.2167 },
        serviceRadius: 10
      },
      {
        address: 'Sector 18, Noida',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201301',
        coordinates: { latitude: 28.5706, longitude: 77.3261 },
        serviceRadius: 15
      },
      {
        address: 'Greater Kailash, New Delhi',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110048',
        coordinates: { latitude: 28.5494, longitude: 77.2484 },
        serviceRadius: 8
      }
    ];
    
    for (let i = 0; i < adminsToUpdate.length; i++) {
      const admin = adminsToUpdate[i];
      const jurisdiction = jurisdictionTemplates[i % jurisdictionTemplates.length];
      
      const updatedAdmin = await User.findByIdAndUpdate(
        admin._id,
        { $set: { adminJurisdiction: jurisdiction } },
        { new: true }
      );
      
      console.log(`\n✅ Updated admin: ${admin.name} (${admin.email})`);
      console.log(`📍 Jurisdiction: ${jurisdiction.city}, ${jurisdiction.state}`);
      console.log(`🎯 Service area: ${jurisdiction.serviceRadius}km radius`);
    }
    
    console.log('\n🎉 All admins updated successfully!');
    
  } catch (error) {
    console.error('❌ Error updating admins:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the update
updateAllAdmins();