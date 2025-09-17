// Comprehensive end-to-end test for location-based filtering system
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Issue = require('./models/Issue');

async function comprehensiveTest() {
  try {
    console.log('🚀 Starting comprehensive location-based filtering test...\n');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Test 1: Check all users have proper location data
    console.log('📋 TEST 1: User Location Data');
    console.log('='.repeat(50));
    
    const allUsers = await User.find({});
    console.log(`Total users: ${allUsers.length}\n`);
    
    for (const user of allUsers) {
      console.log(`👤 ${user.name} (${user.userType})`);
      console.log(`   Email: ${user.email}`);
      
      if (user.userType === 'admin') {
        console.log(`   Jurisdiction: ${user.adminJurisdiction?.city}, ${user.adminJurisdiction?.state}`);
        console.log(`   Coordinates: ${user.adminJurisdiction?.coordinates?.latitude}, ${user.adminJurisdiction?.coordinates?.longitude}`);
        console.log(`   Service Radius: ${user.adminJurisdiction?.serviceRadius}km`);
      } else {
        console.log(`   Location: ${user.location?.city}, ${user.location?.state}`);
        console.log(`   Coordinates: ${user.location?.coordinates?.latitude}, ${user.location?.coordinates?.longitude}`);
        console.log(`   Service Radius: ${user.location?.serviceRadius}km`);
      }
      console.log();
    }

    // Test 2: Check all issues have proper location data
    console.log('📋 TEST 2: Issue Location Data');
    console.log('='.repeat(50));
    
    const allIssues = await Issue.find({});
    console.log(`Total issues: ${allIssues.length}\n`);
    
    for (const issue of allIssues) {
      console.log(`📝 "${issue.title}"`);
      console.log(`   Location: ${issue.location?.city}, ${issue.location?.state}, ${issue.location?.pincode}`);
      console.log(`   Coordinates: ${issue.location?.coordinates?.latitude}, ${issue.location?.coordinates?.longitude}`);
      console.log(`   Reported by: ${issue.reportedBy}`);
      console.log();
    }

    // Test 3: Simulate API filtering for each user type
    console.log('📋 TEST 3: API Filtering Simulation');
    console.log('='.repeat(50));
    
    const admins = allUsers.filter(u => u.userType === 'admin');
    const regularUsers = allUsers.filter(u => u.userType === 'user');
    
    console.log(`\n🏛️ ADMIN FILTERING (${admins.length} admins):`);
    for (const admin of admins) {
      console.log(`\nAdmin: ${admin.name}`);
      console.log(`Jurisdiction: ${admin.adminJurisdiction?.city}, ${admin.adminJurisdiction?.state}`);
      
      // Simulate admin filtering logic
      let visibleIssues = 0;
      for (const issue of allIssues) {
        if (issue.location?.city?.toLowerCase() === admin.adminJurisdiction?.city?.toLowerCase() &&
            issue.location?.state?.toLowerCase() === admin.adminJurisdiction?.state?.toLowerCase()) {
          visibleIssues++;
          console.log(`  ✅ Can see: "${issue.title}"`);
        }
      }
      console.log(`  📊 Total visible: ${visibleIssues}/${allIssues.length} issues`);
    }
    
    console.log(`\n👤 USER FILTERING (${regularUsers.length} users):`);
    for (const user of regularUsers) {
      console.log(`\nUser: ${user.name}`);
      console.log(`Location: ${user.location?.city}, ${user.location?.state}`);
      
      // Simulate user filtering logic
      let visibleIssues = 0;
      for (const issue of allIssues) {
        if (issue.location?.city?.toLowerCase() === user.location?.city?.toLowerCase() &&
            issue.location?.state?.toLowerCase() === user.location?.state?.toLowerCase()) {
          visibleIssues++;
          console.log(`  ✅ Can see: "${issue.title}" (city/state match)`);
        }
      }
      console.log(`  📊 Total visible: ${visibleIssues}/${allIssues.length} issues`);
    }

    // Test 4: Data integrity checks
    console.log('\n📋 TEST 4: Data Integrity Checks');
    console.log('='.repeat(50));
    
    const usersWithoutLocation = allUsers.filter(u => 
      u.userType === 'user' && (!u.location || !u.location.city || !u.location.coordinates)
    );
    const adminsWithoutJurisdiction = allUsers.filter(u => 
      u.userType === 'admin' && (!u.adminJurisdiction || !u.adminJurisdiction.city || !u.adminJurisdiction.coordinates)
    );
    const issuesWithoutLocation = allIssues.filter(i => !i.location || !i.location.city);
    
    console.log(`❌ Users without proper location: ${usersWithoutLocation.length}`);
    console.log(`❌ Admins without proper jurisdiction: ${adminsWithoutJurisdiction.length}`);
    console.log(`❌ Issues without proper location: ${issuesWithoutLocation.length}`);
    
    if (usersWithoutLocation.length === 0 && adminsWithoutJurisdiction.length === 0 && issuesWithoutLocation.length === 0) {
      console.log('\n🎉 ALL DATA INTEGRITY CHECKS PASSED!');
    } else {
      console.log('\n⚠️ Some data integrity issues found.');
    }

    console.log('\n✅ Comprehensive test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the comprehensive test
comprehensiveTest();