// Debug script to check issues and their location data
const mongoose = require('mongoose');
const Issue = require('./models/Issue');

require('dotenv').config();

const checkIssues = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Find all issues
    const issues = await Issue.find().sort({ createdAt: -1 });
    console.log('\n📊 Issues Found:', issues.length);
    
    issues.forEach((issue, index) => {
      console.log(`\n📋 Issue ${index + 1}:`);
      console.log('Title:', issue.title);
      console.log('Description:', issue.description);
      console.log('Category:', issue.category);
      console.log('Location:', JSON.stringify(issue.location, null, 2));
      console.log('Created:', issue.createdAt);
    });
    
    console.log('\n🎯 Analysis for Admin Jurisdiction: New Delhi, Delhi, 110076');
    console.log('Admin should see issues where:');
    console.log('- City: "New Delhi" (case insensitive)');
    console.log('- State: "Delhi" (case insensitive)');
    console.log('- OR Pincode: "110076"');
    console.log('- OR within 10km of coordinates: 28.5355, 77.294');
    
    mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

checkIssues();