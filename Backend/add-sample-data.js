// 📝 Add Sample Issues for Admin Dashboard Testing
// Run this after MongoDB Atlas connection is working

const mongoose = require('mongoose');
require('dotenv').config();

const Issue = require('./models/Issue');

async function addSampleIssues() {
  try {
    console.log('🔍 Adding sample issues for admin dashboard testing...\n');

    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB Atlas!\n');

    // Sample issues data
    const sampleIssues = [
      {
        title: 'Broken Street Light on MG Road',
        description: 'The street light near the bus stop has been non-functional for over a week, causing safety concerns for commuters.',
        category: 'Infrastructure',
        location: 'MG Road, Sector 14, Delhi',
        reportedBy: 'Rajesh Kumar',
        status: 'Open',
        votes: 12
      },
      {
        title: 'Water Leakage in Residential Area',
        description: 'Continuous water leakage from main pipeline causing waterlogging and wastage of water.',
        category: 'Water Supply',
        location: 'Block A, Janakpuri, Delhi',
        reportedBy: 'Priya Sharma',
        status: 'Open',
        votes: 8
      },
      {
        title: 'Garbage Collection Issue',
        description: 'Garbage has not been collected for the past 4 days in our society, creating unhygienic conditions.',
        category: 'Waste Management',
        location: 'Green Park Extension, Delhi',
        reportedBy: 'Amit Singh',
        status: 'Open',
        votes: 15
      },
      {
        title: 'Traffic Signal Malfunction',
        description: 'Traffic signal at the main intersection is not working properly, causing traffic jams during peak hours.',
        category: 'Traffic',
        location: 'CP Metro Station, Connaught Place, Delhi',
        reportedBy: 'Meera Gupta',
        status: 'In Progress',
        votes: 20
      },
      {
        title: 'Pothole on Main Highway',
        description: 'Large pothole on the main highway causing damage to vehicles and creating traffic bottlenecks.',
        category: 'Infrastructure',
        location: 'Delhi-Gurgaon Expressway, Km 15',
        reportedBy: 'Vikram Patel',
        status: 'Resolved',
        votes: 25
      },
      {
        title: 'No Water Supply Since Yesterday',
        description: 'Complete water supply cut-off in our locality for the past 24 hours without any prior notice.',
        category: 'Water Supply',
        location: 'Laxmi Nagar, East Delhi',
        reportedBy: 'Sunita Devi',
        status: 'Open',
        votes: 18
      },
      {
        title: 'Overflowing Drainage System',
        description: 'Drainage system is overflowing due to recent rains, causing waterlogging and foul smell.',
        category: 'Infrastructure',
        location: 'Mayur Vihar Phase 1, Delhi',
        reportedBy: 'Rohit Agarwal',
        status: 'Open',
        votes: 10
      }
    ];

    // Clear existing issues (optional)
    await Issue.deleteMany({});
    console.log('🗑️ Cleared existing sample issues');

    // Add sample issues
    const createdIssues = await Issue.insertMany(sampleIssues);
    console.log(`✅ Added ${createdIssues.length} sample issues!`);

    // Show summary
    console.log('\n📊 Issues Summary:');
    const statusCount = await Issue.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    statusCount.forEach(item => {
      console.log(`   ${item._id}: ${item.count} issues`);
    });

    console.log('\n🎉 Sample data ready! You can now test the admin dashboard.');
    console.log('💡 Login as an admin to see these issues in the dashboard table.');

  } catch (error) {
    console.error('❌ Error adding sample issues:', error.message);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
    process.exit(0);
  }
}

// Run the script
addSampleIssues();
