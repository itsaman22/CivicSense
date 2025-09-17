// Script to update admin user with jurisdiction data
const mongoose = require('mongoose');
const User = require('./models/User');

require('dotenv').config();

const updateAdminJurisdiction = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Update the admin user "Admin test" with Sarita Vihar jurisdiction
    const adminEmail = 'admin1@civic.com'; // The email from the debug output
    
    const updatedAdmin = await User.findOneAndUpdate(
      { email: adminEmail },
      {
        $set: {
          adminJurisdiction: {
            address: 'Sarita Vihar, New Delhi',
            city: 'New Delhi',
            state: 'Delhi',
            pincode: '110076',
            coordinates: {
              latitude: 28.5355, // Approximate coordinates for Sarita Vihar
              longitude: 77.2940
            },
            serviceRadius: 10
          }
        }
      },
      { new: true }
    );
    
    if (updatedAdmin) {
      console.log('✅ Successfully updated admin jurisdiction:');
      console.log('Admin:', updatedAdmin.name);
      console.log('Email:', updatedAdmin.email);
      console.log('New Jurisdiction:', JSON.stringify(updatedAdmin.adminJurisdiction, null, 2));
    } else {
      console.log('❌ Admin user not found');
    }
    
    mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Error updating admin:', error);
    process.exit(1);
  }
};

updateAdminJurisdiction();