// Script to add coordinates to existing user locations
const mongoose = require('mongoose');
const User = require('./models/User');

require('dotenv').config();

// Approximate coordinates for major cities
const cityCoordinates = {
  'south delhi': { latitude: 28.5355, longitude: 77.2940 },
  'new delhi': { latitude: 28.6139, longitude: 77.2090 },
  'delhi': { latitude: 28.6139, longitude: 77.2090 },
  'greater noida': { latitude: 28.4744, longitude: 77.5040 },
  'noida': { latitude: 28.5355, longitude: 77.3910 },
  'gurgaon': { latitude: 28.4595, longitude: 77.0266 },
  'mumbai': { latitude: 19.0760, longitude: 72.8777 },
  'bangalore': { latitude: 12.9716, longitude: 77.5946 },
  'chennai': { latitude: 13.0827, longitude: 80.2707 },
  'hyderabad': { latitude: 17.3850, longitude: 78.4867 },
  'pune': { latitude: 18.5204, longitude: 73.8567 },
  'kolkata': { latitude: 22.5726, longitude: 88.3639 },
  // Add default for test cities
  'test': { latitude: 10.0, longitude: 76.0 }, // Kerala approximate
};

const updateUserCoordinates = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const regularUsers = await User.find({ userType: 'user' });
    console.log(`\n📊 Updating ${regularUsers.length} regular users with coordinates...`);
    
    for (const user of regularUsers) {
      if (user.location && user.location.city) {
        const cityKey = user.location.city.toLowerCase();
        const coords = cityCoordinates[cityKey];
        
        if (coords) {
          await User.findByIdAndUpdate(user._id, {
            $set: {
              'location.coordinates': coords,
              'location.serviceRadius': 5 // 5km radius for regular users
            }
          });
          
          console.log(`✅ Updated ${user.name} (${user.location.city}) with coordinates:`, coords);
        } else {
          console.log(`⚠️ No coordinates found for city: ${user.location.city}`);
        }
      }
    }
    
    console.log('\n🎉 User coordinate update complete!');
    mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Error updating user coordinates:', error);
    process.exit(1);
  }
};

updateUserCoordinates();