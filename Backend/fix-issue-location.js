// Script to fix the Sarita Vihar issue location data
const mongoose = require('mongoose');
const Issue = require('./models/Issue');

require('dotenv').config();

const fixIssueLocation = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Find and update the Sarita Vihar issue
    const issueTitle = 'Pathole on the Road';
    
    const updatedIssue = await Issue.findOneAndUpdate(
      { title: issueTitle },
      {
        $set: {
          'location.city': 'New Delhi',
          'location.state': 'Delhi', 
          'location.pincode': '110076',
          'location.coordinates': {
            latitude: 28.5355,
            longitude: 77.2940
          }
        }
      },
      { new: true }
    );
    
    if (updatedIssue) {
      console.log('✅ Successfully updated issue location:');
      console.log('Title:', updatedIssue.title);
      console.log('Updated Location:', JSON.stringify(updatedIssue.location, null, 2));
      console.log('\n🎯 This issue should now be visible to Delhi admin!');
    } else {
      console.log('❌ Issue not found');
    }
    
    mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Error updating issue:', error);
    process.exit(1);
  }
};

fixIssueLocation();