const express = require('express');
const router = express.Router();
const { checkLogin } = require('../middleware/auth');

// Simple array to store issues
let issues = [
  {
    id: 1,
    title: 'Broken Street Light',
    description: 'The street light on Main Street is not working',
    category: 'Infrastructure',
    status: 'Open',
    location: 'Main Street, Downtown',
    reportedBy: 'John Doe',
    votes: 5,
    createdAt: new Date().toISOString()
  }
];

// Get all issues
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Issues retrieved successfully',
    data: {
      issues: issues
    }
  });
});

// Get single issue by ID
router.get('/:id', (req, res) => {
  const issueId = parseInt(req.params.id);
  const issue = issues.find(issue => issue.id === issueId);

  if (!issue) {
    return res.json({
      success: false,
      message: 'Issue not found'
    });
  }

  res.json({
    success: true,
    message: 'Issue found',
    data: {
      issue: issue
    }
  });
});

// Create new issue (need to be logged in)
router.post('/', checkLogin, (req, res) => {
  const { title, description, category, location } = req.body;

  // Check if all required fields are provided
  if (!title || !description || !category || !location) {
    return res.json({
      success: false,
      message: 'Please provide title, description, category, and location'
    });
  }

  // Create new issue
  const newIssue = {
    id: issues.length + 1,
    title: title,
    description: description,
    category: category,
    status: 'Open',
    location: location,
    reportedBy: 'User',
    votes: 0,
    createdAt: new Date().toISOString()
  };

  issues.push(newIssue);

  res.json({
    success: true,
    message: 'Issue created successfully',
    data: {
      issue: newIssue
    }
  });
});

// Vote on an issue (need to be logged in)
router.post('/:id/vote', checkLogin, (req, res) => {
  const issueId = parseInt(req.params.id);
  const issue = issues.find(issue => issue.id === issueId);

  if (!issue) {
    return res.json({
      success: false,
      message: 'Issue not found'
    });
  }

  // Add one vote
  issue.votes += 1;

  res.json({
    success: true,
    message: 'Vote added successfully',
    data: {
      issueId: issueId,
      newVoteCount: issue.votes
    }
  });
});

// Update issue status (need to be logged in)
router.put('/:id/status', checkLogin, (req, res) => {
  const issueId = parseInt(req.params.id);
  const { status } = req.body;
  
  const issue = issues.find(issue => issue.id === issueId);

  if (!issue) {
    return res.json({
      success: false,
      message: 'Issue not found'
    });
  }

  // Update status
  issue.status = status;

  res.json({
    success: true,
    message: 'Issue status updated successfully',
    data: {
      issue: issue
    }
  });
});

module.exports = router;
