const express = require('express');
const router = express.Router();

// Simple array to store users (like a simple database)
let users = [
  {
    id: 1,
    email: 'admin@civic.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    department: 'Municipal Corporation',
    location: null
  },
  {
    id: 2,
    email: 'user@civic.com', 
    password: 'user123',
    name: 'John Doe',
    role: 'user',
    department: null,
    location: 'Delhi'
  }
];

// Register new user
router.post('/register', (req, res) => {
  const { email, password, name, userType, department, location } = req.body;

  // Check if user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.json({
      success: false,
      message: 'User already exists with this email'
    });
  }

  // Create new user
  const newUser = {
    id: users.length + 1,
    email: email,
    password: password,
    name: name,
    role: userType || 'user', // admin or user
    department: department || null, // for admin users
    location: location || null // for regular users
  };

  users.push(newUser);

  // Create simple token
  const token = 'token_' + Date.now() + '_' + newUser.id;

  res.json({
    success: true,
    message: 'Registration successful',
    data: {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        department: newUser.department,
        location: newUser.location
      },
      token: token
    }
  });
});

// Login user
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.json({
      success: false,
      message: 'Wrong email or password'
    });
  }

  // Create simple token
  const token = 'token_' + Date.now() + '_' + user.id;

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        location: user.location
      },
      token: token
    }
  });
});

module.exports = router;
