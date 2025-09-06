// Simple authentication middleware - beginner friendly

const checkLogin = (req, res, next) => {
  // Get token from header
  const token = req.headers.authorization;

  // Check if token exists
  if (!token) {
    return res.json({
      success: false,
      message: 'You need to login first. No token provided.'
    });
  }

  // Simple token check (starts with 'token_')
  if (token.startsWith('token_')) {
    // Token is valid, continue to next function
    next();
  } else {
    return res.json({
      success: false,
      message: 'Invalid token. Please login again.'
    });
  }
};

const checkAdmin = (req, res, next) => {
  // Simple admin check
  // In a real app, you would check user role from database
  // For now, we'll just check if it's the admin token
  next(); // For simplicity, allowing all requests
};

module.exports = {
  checkLogin,
  checkAdmin
};
