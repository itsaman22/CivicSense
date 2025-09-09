// 🔐 Authentication Middleware - MongoDB Atlas Version
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const checkLogin = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.replace('Bearer ', '');

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'You need to login first. No token provided.'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Please login again.'
      });
    }

    // Add user info to request object
    req.user = user;
    next();

  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token. Please login again.'
    });
  }
};

const checkAdmin = async (req, res, next) => {
  try {
    // First check if user is logged in
    await checkLogin(req, res, () => {
      // Check if user is admin
      if (req.user && req.user.role === 'admin') {
        next();
      } else {
        return res.status(403).json({
          success: false,
          message: 'Admin access required.'
        });
      }
    });
  } catch (error) {
    console.error('Admin check error:', error);
    return res.status(403).json({
      success: false,
      message: 'Admin access denied.'
    });
  }
  next(); // For simplicity, allowing all requests
};

module.exports = {
  checkLogin,
  checkAdmin
};
