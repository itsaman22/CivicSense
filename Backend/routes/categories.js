const express = require('express');
const router = express.Router();

// Simple array to store categories
let categories = [
  {
    id: 1,
    name: 'Infrastructure',
    description: 'Roads, bridges, buildings',
    icon: '🏗️'
  },
  {
    id: 2,
    name: 'Transportation',
    description: 'Traffic, buses, parking',
    icon: '🚗'
  },
  {
    id: 3,
    name: 'Environment',
    description: 'Pollution, waste, parks',
    icon: '🌱'
  },
  {
    id: 4,
    name: 'Safety',
    description: 'Street lights, security',
    icon: '🛡️'
  },
  {
    id: 5,
    name: 'Other',
    description: 'Other civic issues',
    icon: '📋'
  }
];

// Get all categories
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Categories retrieved successfully',
    data: {
      categories: categories
    }
  });
});

// Get single category by ID
router.get('/:id', (req, res) => {
  const categoryId = parseInt(req.params.id);
  const category = categories.find(cat => cat.id === categoryId);

  if (!category) {
    return res.json({
      success: false,
      message: 'Category not found'
    });
  }

  res.json({
    success: true,
    message: 'Category found',
    data: {
      category: category
    }
  });
});

// Create new category
router.post('/', (req, res) => {
  const { name, description, icon } = req.body;

  if (!name) {
    return res.json({
      success: false,
      message: 'Category name is required'
    });
  }

  const newCategory = {
    id: categories.length + 1,
    name: name,
    description: description || '',
    icon: icon || '📋'
  };

  categories.push(newCategory);

  res.json({
    success: true,
    message: 'Category created successfully',
    data: {
      category: newCategory
    }
  });
});

// Update category
router.put('/:id', (req, res) => {
  const categoryId = parseInt(req.params.id);
  const { name, description, icon } = req.body;

  const categoryIndex = categories.findIndex(cat => cat.id === categoryId);

  if (categoryIndex === -1) {
    return res.json({
      success: false,
      message: 'Category not found'
    });
  }

  // Update category data
  if (name) categories[categoryIndex].name = name;
  if (description) categories[categoryIndex].description = description;
  if (icon) categories[categoryIndex].icon = icon;

  res.json({
    success: true,
    message: 'Category updated successfully',
    data: {
      category: categories[categoryIndex]
    }
  });
});

// Delete category
router.delete('/:id', (req, res) => {
  const categoryId = parseInt(req.params.id);
  const categoryIndex = categories.findIndex(cat => cat.id === categoryId);

  if (categoryIndex === -1) {
    return res.json({
      success: false,
      message: 'Category not found'
    });
  }

  const deletedCategory = categories.splice(categoryIndex, 1)[0];

  res.json({
    success: true,
    message: 'Category deleted successfully',
    data: {
      deletedCategory: deletedCategory
    }
  });
});

module.exports = router;
