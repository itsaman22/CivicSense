// 🏛️ Issues Routes - MongoDB Atlas Version
const express = require('express');
const Issue = require('../models/Issue'); // Import Issue model
const { checkLogin } = require('../middleware/auth');

const router = express.Router();

// 📋 Get all issues
router.get('/', async (req, res) => {
  try {
    // Get all issues from database, sorted by newest first
    const issues = await Issue.find()
      .populate('reportedBy', 'name email')
      .populate('comments.user', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      message: 'Issues retrieved successfully',
      data: {
        issues: issues,
        total: issues.length
      }
    });
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching issues'
    });
  }
});

// 🔍 Get single issue by ID
router.get('/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reportedBy', 'name email')
      .populate('comments.user', 'name email');

    if (!issue) {
      return res.status(404).json({
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
  } catch (error) {
    console.error('Error fetching issue:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching issue'
    });
  }
});

// ➕ Create new issue (need to be logged in)
router.post('/', checkLogin, async (req, res) => {
  try {
    const { title, description, category, location, images } = req.body;

    // Check if all required fields are provided
    if (!title || !description || !category || !location) {
      return res.json({
        success: false,
        message: 'Please provide title, description, category, and location'
      });
    }

    // Validate images
    if (!images || !Array.isArray(images) || images.length < 2) {
      return res.json({
        success: false,
        message: 'At least 2 images are required as proof of the issue'
      });
    }

    if (images.length > 5) {
      return res.json({
        success: false,
        message: 'Maximum 5 images are allowed'
      });
    }

    // Validate each image
    const processedImages = [];
    for (const image of images) {
      // Check if image data exists
      if (!image.data || !image.filename || !image.mimetype || !image.size) {
        return res.json({
          success: false,
          message: 'Invalid image data. Please ensure all images are properly uploaded.'
        });
      }

      // Check file size (2MB limit)
      if (image.size > 2097152) {
        return res.json({
          success: false,
          message: `Image "${image.filename}" is too large. Maximum size is 2MB.`
        });
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(image.mimetype)) {
        return res.json({
          success: false,
          message: `Image "${image.filename}" has invalid format. Only JPEG, PNG, and WebP are allowed.`
        });
      }

      processedImages.push({
        data: image.data,
        filename: image.filename,
        mimetype: image.mimetype,
        size: image.size,
        uploadedAt: new Date()
      });
    }

    // Create new issue
    const newIssue = new Issue({
      title: title,
      description: description,
      category: category,
      location: {
        address: location.address || location,
        coordinates: location.coordinates || {},
        city: location.city || '',
        state: location.state || '',
        pincode: location.pincode || ''
      },
      reportedBy: req.user.id, // Use ObjectId from auth middleware
      status: 'Open', // Default status
      upvotes: 0, // Start with 0 upvotes
      downvotes: 0, // Start with 0 downvotes
      comments: [], // Empty comments array
      images: processedImages // Add processed images
    });

    // Save to database
    const savedIssue = await newIssue.save();
    
    // Populate user info for response (but don't include image data to reduce response size)
    await savedIssue.populate('reportedBy', 'name email');
    
    // Create response without full image data
    const responseIssue = savedIssue.toObject();
    responseIssue.images = responseIssue.images.map(img => ({
      filename: img.filename,
      mimetype: img.mimetype,
      size: img.size,
      uploadedAt: img.uploadedAt
    }));

    res.status(201).json({
      success: true,
      message: 'Issue created successfully with images',
      data: {
        issue: responseIssue
      }
    });

  } catch (error) {
    console.error('Error creating issue:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating issue'
    });
  }
});

// 👍 Upvote an issue (need to be logged in)
router.post('/:id/upvote', checkLogin, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    const userId = req.user.id;

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Check if user has already upvoted
    if (issue.upvotedBy.includes(userId)) {
      return res.json({
        success: false,
        message: 'You have already upvoted this issue'
      });
    }

    // Remove from downvote if exists
    if (issue.downvotedBy.includes(userId)) {
      issue.downvotedBy.pull(userId);
      issue.downvotes -= 1;
    }

    // Add upvote
    issue.upvotedBy.push(userId);
    issue.upvotes += 1;
    await issue.save();

    res.json({
      success: true,
      message: 'Issue upvoted successfully',
      data: {
        issueId: issue._id,
        upvotes: issue.upvotes,
        downvotes: issue.downvotes
      }
    });

  } catch (error) {
    console.error('Error upvoting issue:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while upvoting'
    });
  }
});

// 👎 Downvote an issue (need to be logged in)
router.post('/:id/downvote', checkLogin, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    const userId = req.user.id;

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Check if user has already downvoted
    if (issue.downvotedBy.includes(userId)) {
      return res.json({
        success: false,
        message: 'You have already downvoted this issue'
      });
    }

    // Remove from upvote if exists
    if (issue.upvotedBy.includes(userId)) {
      issue.upvotedBy.pull(userId);
      issue.upvotes -= 1;
    }

    // Add downvote
    issue.downvotedBy.push(userId);
    issue.downvotes += 1;
    await issue.save();

    res.json({
      success: true,
      message: 'Issue downvoted successfully',
      data: {
        issueId: issue._id,
        upvotes: issue.upvotes,
        downvotes: issue.downvotes
      }
    });

  } catch (error) {
    console.error('Error downvoting issue:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while downvoting'
    });
  }
});

// 🚨 Report a false issue (need to be logged in)
router.post('/:id/report', checkLogin, async (req, res) => {
  try {
    const { reason } = req.body;
    const issue = await Issue.findById(req.params.id);
    const userId = req.user.id;

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Check if user has already reported
    const hasReported = issue.reports.some(report => report.reportedBy.toString() === userId);
    if (hasReported) {
      return res.json({
        success: false,
        message: 'You have already reported this issue'
      });
    }

    // Add report
    issue.reports.push({
      reportedBy: userId,
      reason: reason || 'Reported as false or inappropriate',
      createdAt: new Date()
    });

    await issue.save();

    res.json({
      success: true,
      message: 'Issue reported successfully',
      data: {
        issueId: issue._id,
        reportCount: issue.reports.length
      }
    });

  } catch (error) {
    console.error('Error reporting issue:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while reporting issue'
    });
  }
});

// 💬 Add comment to an issue (need to be logged in)
router.post('/:id/comment', checkLogin, async (req, res) => {
  try {
    const { comment } = req.body;
    const issue = await Issue.findById(req.params.id);
    const userId = req.user.id;

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    if (!comment || comment.trim().length === 0) {
      return res.json({
        success: false,
        message: 'Comment cannot be empty'
      });
    }

    // Add comment
    issue.comments.push({
      user: userId,
      comment: comment.trim(),
      createdAt: new Date()
    });

    await issue.save();

    // Populate the comments with user info for response
    await issue.populate('comments.user', 'name email');

    res.json({
      success: true,
      message: 'Comment added successfully',
      data: {
        issueId: issue._id,
        comments: issue.comments
      }
    });

  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding comment'
    });
  }
});

// �️ Get image from issue
router.get('/:id/image/:imageIndex', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    const imageIndex = parseInt(req.params.imageIndex);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    if (!issue.images || imageIndex >= issue.images.length || imageIndex < 0) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    const image = issue.images[imageIndex];
    const buffer = Buffer.from(image.data, 'base64');

    res.set({
      'Content-Type': image.mimetype,
      'Content-Length': buffer.length,
      'Cache-Control': 'public, max-age=86400' // Cache for 1 day
    });
    
    res.send(buffer);

  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while serving image'
    });
  }
});

// �🔄 Update issue status (need to be logged in)
router.put('/:id/status', checkLogin, async (req, res) => {
  try {
    const { status } = req.body;
    
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true } // Return updated document
    );

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    res.json({
      success: true,
      message: 'Issue status updated successfully',
      data: {
        issue: issue
      }
    });

  } catch (error) {
    console.error('Error updating issue status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating status'
    });
  }
});

module.exports = router;
