const express = require('express');
const router = express.Router();

// Simple array to store users
let users = [
  {
    id: 1,
    email: 'admin@civic.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: 2,
    email: 'user@civic.com',
    password: 'user123',
    name: 'John Doe',
    role: 'user'
  }
];

// Get all users
router.get('/', (req, res) => {
  // Remove passwords before sending
  const safeUsers = users.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });

  res.json({
    success: true,
    message: 'Users retrieved successfully',
    data: {
      users: safeUsers
    }
  });
});

// Get single user by ID
router.get('/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(user => user.id === userId);

  if (!user) {
    return res.json({
      success: false,
      message: 'User not found'
    });
  }

  // Remove password before sending
  const { password, ...userWithoutPassword } = user;

  res.json({
    success: true,
    message: 'User found',
    data: {
      user: userWithoutPassword
    }
  });
});

// Update user
router.put('/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email } = req.body;

  const userIndex = users.findIndex(user => user.id === userId);

  if (userIndex === -1) {
    return res.json({
      success: false,
      message: 'User not found'
    });
  }

  // Update user data
  if (name) users[userIndex].name = name;
  if (email) users[userIndex].email = email;

  // Remove password before sending
  const { password, ...updatedUser } = users[userIndex];

  res.json({
    success: true,
    message: 'User updated successfully',
    data: {
      user: updatedUser
    }
  });
});

// Delete user
router.delete('/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(user => user.id === userId);

  if (userIndex === -1) {
    return res.json({
      success: false,
      message: 'User not found'
    });
  }

  const deletedUser = users.splice(userIndex, 1)[0];
  const { password, ...userWithoutPassword } = deletedUser;

  res.json({
    success: true,
    message: 'User deleted successfully',
    data: {
      deletedUser: userWithoutPassword
    }
  });
});

module.exports = router;
