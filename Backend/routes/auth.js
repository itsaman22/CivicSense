// 🔐 Authentication Routes - MongoDB Atlas Version
const express = require('express');
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For creating tokens
const User = require('../models/User'); // Import User model

const router = express.Router();

// 📝 Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, userType, department, location, designation, adminJurisdiction } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Hash password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      email: email,
      password: hashedPassword,
      name: name,
      userType: userType || 'user', // Use userType to match model
      department: department || null, // for admin users
      designation: designation || null, // for admin users
      location: location || null, // for regular users
      adminJurisdiction: adminJurisdiction || null // for admin users - their service area
    });

    // Save user to database
    const savedUser = await newUser.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: savedUser._id, email: savedUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: savedUser._id,
          email: savedUser.email,
          name: savedUser.name,
          role: savedUser.userType, // Use userType from model
          department: savedUser.department,
          designation: savedUser.designation,
          location: savedUser.location,
          adminJurisdiction: savedUser.adminJurisdiction
        },
        token: token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// 🔑 Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user in database
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: 'User not found with this email'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.userType, // Use userType from model
          department: user.department,
          designation: user.designation,
          location: user.location,
          adminJurisdiction: user.adminJurisdiction
        },
        token: token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

module.exports = router;
