// 🚨 Issue Model - For reporting civic problems
const mongoose = require('mongoose');

// Create schema for civic issues
const issueSchema = new mongoose.Schema({
  // Basic issue information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  
  // Issue category
  category: {
    type: String,
    required: true,
    enum: [
      'Infrastructure',
      'Transportation', 
      'Environment',
      'Public Safety',
      'Sanitation',
      'Parks & Recreation',
      'Public Health',
      'Technology',
      'Other'
    ]
  },
  
  // Issue priority
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  
  // Issue status
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed', 'Rejected'],
    default: 'Open'
  },
  
  // Location information
  location: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    city: String,
    state: String,
    pincode: String
  },
  
  // Who reported this issue
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User
    ref: 'User', // This connects to User model
    required: true
  },
  
  // Admin who is handling this issue
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  // Community engagement - Updated voting system
  upvotes: {
    type: Number,
    default: 0
  },
  
  downvotes: {
    type: Number,
    default: 0
  },

  // People who upvoted this issue
  upvotedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // People who downvoted this issue
  downvotedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Reports for false/inappropriate issues
  reports: [{
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reason: {
      type: String,
      default: 'Reported as false or inappropriate'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Comments on this issue
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    comment: {
      type: String,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Issue images - stored as base64 strings for MongoDB free cluster
  images: {
    type: [{
      data: {
        type: String, // base64 encoded image data
        required: true
      },
      filename: {
        type: String,
        required: true
      },
      mimetype: {
        type: String,
        required: true,
        enum: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      },
      size: {
        type: Number,
        required: true,
        max: 2097152 // 2MB in bytes
      },
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    validate: [
      {
        validator: function(images) {
          return images && images.length >= 2;
        },
        message: 'At least 2 images are required as proof'
      },
      {
        validator: function(images) {
          return images && images.length <= 5;
        },
        message: 'Maximum 5 images are allowed'
      }
    ]
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
issueSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create the Issue model
const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;
