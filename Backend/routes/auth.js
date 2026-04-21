// 🔐 Authentication Routes - MongoDB Atlas Version
const express = require('express');
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For creating tokens
const User = require('../models/User'); // Import User model
const CoinHistory = require('../models/CoinHistory'); // Import CoinHistory model

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
      adminJurisdiction: adminJurisdiction || null, // for admin users - their service area
      coins: 10 // Welcome bonus: 10 coins for all new users
    });

    // Save user to database
    const savedUser = await newUser.save();

    // Create CoinHistory entry for welcome bonus
    const welcomeBonus = new CoinHistory({
      userId: savedUser._id,
      coinsEarned: 10,
      transactionType: 'welcome_bonus',
      description: 'Welcome bonus for creating account'
    });
    await welcomeBonus.save();

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
          adminJurisdiction: savedUser.adminJurisdiction,
          coins: 10 // Show the welcome bonus coins
        },
        token: token,
        welcomeBonus: {
          coins: 10,
          message: '🎉 Welcome! You received 10 coins as a sign-up bonus!'
        }
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
          adminJurisdiction: user.adminJurisdiction,
          coins: user.coins || 0 // Include coin balance
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

// 🪙 Migrate coins to existing users (Admin only)
router.post('/migrate-coins', async (req, res) => {
  try {
    const authToken = req.headers.authorization;
    
    // Simple security check - must have token
    if (!authToken) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Update all users with coins < 10 to have 10 coins
    const result = await User.updateMany(
      { coins: { $lt: 10 } },
      { coins: 10 }
    );

    console.log(`Migration: Updated ${result.modifiedCount} users with 10 coins`);

    // Create CoinHistory entries for migrated users
    const usersWithCoins = await User.find({ coins: 10 });
    let historyCount = 0;

    for (const user of usersWithCoins) {
      const existingBonus = await CoinHistory.findOne({
        userId: user._id,
        transactionType: 'welcome_bonus'
      });

      if (!existingBonus) {
        const coinHistory = new CoinHistory({
          userId: user._id,
          coinsEarned: 10,
          transactionType: 'welcome_bonus',
          description: 'Welcome bonus - Migrated from account creation'
        });
        await coinHistory.save();
        historyCount++;
      }
    }

    res.json({
      success: true,
      message: 'Migration completed successfully',
      data: {
        usersUpdated: result.modifiedCount,
        historyCreated: historyCount,
        totalUsersWithCoins: usersWithCoins.length
      }
    });

  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during migration'
    });
  }
});

module.exports = router;
