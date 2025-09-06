const express = require('express');
const router = express.Router();

// Simple arrays to store data
let users = [
  {
    id: 1,
    email: 'admin@civic.com',
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: 2,
    email: 'user@civic.com',
    name: 'John Doe',
    role: 'user'
  }
];

let issues = [
  {
    id: 1,
    title: 'Broken Street Light',
    description: 'Street light not working',
    category: 'Infrastructure',
    status: 'Open',
    reportedBy: 'John Doe',
    votes: 5,
    createdAt: new Date().toISOString()
  }
];

// Get admin dashboard stats
router.get('/dashboard', (req, res) => {
  const stats = {
    totalUsers: users.length,
    totalIssues: issues.length,
    openIssues: issues.filter(issue => issue.status === 'Open').length,
    closedIssues: issues.filter(issue => issue.status === 'Closed').length
  };

  res.json({
    success: true,
    message: 'Dashboard stats retrieved successfully',
    data: {
      stats: stats
    }
  });
});

// Get all users for admin
router.get('/users', (req, res) => {
  res.json({
    success: true,
    message: 'All users retrieved successfully',
    data: {
      users: users
    }
  });
});

// Get all issues for admin
router.get('/issues', (req, res) => {
  res.json({
    success: true,
    message: 'All issues retrieved successfully',
    data: {
      issues: issues
    }
  });
});

// Update issue status
router.put('/issues/:id/status', (req, res) => {
  const issueId = parseInt(req.params.id);
  const { status } = req.body;

  const issueIndex = issues.findIndex(issue => issue.id === issueId);

  if (issueIndex === -1) {
    return res.json({
      success: false,
      message: 'Issue not found'
    });
  }

  // Valid statuses
  const validStatuses = ['Open', 'In Progress', 'Closed', 'Rejected'];
  if (!validStatuses.includes(status)) {
    return res.json({
      success: false,
      message: 'Invalid status. Use: Open, In Progress, Closed, or Rejected'
    });
  }

  issues[issueIndex].status = status;

  res.json({
    success: true,
    message: 'Issue status updated successfully',
    data: {
      issue: issues[issueIndex]
    }
  });
});

// Delete user (admin only)
router.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(user => user.id === userId);

  if (userIndex === -1) {
    return res.json({
      success: false,
      message: 'User not found'
    });
  }

  const deletedUser = users.splice(userIndex, 1)[0];

  res.json({
    success: true,
    message: 'User deleted successfully',
    data: {
      deletedUser: deletedUser
    }
  });
});

// Delete issue (admin only)
router.delete('/issues/:id', (req, res) => {
  const issueId = parseInt(req.params.id);
  const issueIndex = issues.findIndex(issue => issue.id === issueId);

  if (issueIndex === -1) {
    return res.json({
      success: false,
      message: 'Issue not found'
    });
  }

  const deletedIssue = issues.splice(issueIndex, 1)[0];

  res.json({
    success: true,
    message: 'Issue deleted successfully',
    data: {
      deletedIssue: deletedIssue
    }
  });
});

module.exports = router;
