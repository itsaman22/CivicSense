// 👤 User Model - Simple and Beginner Friendly
const mongoose = require('mongoose');

// Create a schema (like a blueprint) for users
const userSchema = new mongoose.Schema({
  // Basic user info
  name: {
    type: String,
    required: true, // This field is mandatory
    trim: true // Remove extra spaces
  },
  
  email: {
    type: String,
    required: true,
    unique: true, // No two users can have same email
    lowercase: true // Convert to lowercase
  },
  
  password: {
    type: String,
    required: true,
    minlength: 6 // At least 6 characters
  },
  
  phone: {
    type: String,
    required: false // Optional field
  },
  
  // User type: 'user' or 'admin'
  userType: {
    type: String,
    enum: ['user', 'admin'], // Only these values allowed
    default: 'user'
  },
  
  // For regular users - their location
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  
  // For admin users - their department
  department: {
    type: String,
    required: false,
    enum: [
      'mla',
      'mcd', 
      'road_department',
      'jal_board',
      'bijli_vibhag',
      'health_department',
      'fire_department',
      'police_department',
      'other'
    ]
  },
  
  designation: {
    type: String,
    required: false
  },

  // For admin users - their jurisdiction/service area
  adminJurisdiction: {
    address: {
      type: String,
      required: function() {
        return this.userType === 'admin';
      }
    },
    city: {
      type: String,
      required: function() {
        return this.userType === 'admin';
      }
    },
    state: {
      type: String,
      required: function() {
        return this.userType === 'admin';
      }
    },
    pincode: {
      type: String,
      required: function() {
        return this.userType === 'admin';
      }
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    // Service radius in kilometers (optional)
    serviceRadius: {
      type: Number,
      default: 10 // 10km default radius
    }
  },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Automatically add creation date
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
