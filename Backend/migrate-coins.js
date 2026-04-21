// 💰 Migration Script - Add 10 coins to all existing users
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const CoinHistory = require('./models/CoinHistory');

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

// Migrate coins
async function migrateCoins() {
  try {
    // Update all users to have 10 coins if they don't have coins already
    const result = await User.updateMany(
      { coins: { $lt: 10 } },
      { coins: 10 }
    );

    console.log(`✅ Updated ${result.modifiedCount} users with 10 coins`);

    // Get all users who now have coins
    const usersWithCoins = await User.find({ coins: 10 });

    // Create CoinHistory entries for each user who didn't have a welcome bonus
    for (const user of usersWithCoins) {
      // Check if this user already has a welcome bonus entry
      const existingBonus = await CoinHistory.findOne({
        userId: user._id,
        transactionType: 'welcome_bonus'
      });

      if (!existingBonus) {
        const coinHistory = new CoinHistory({
          userId: user._id,
          coinsEarned: 10,
          transactionType: 'welcome_bonus',
          description: 'Welcome bonus - Migrated from account creation'
        });
        await coinHistory.save();
      }
    }

    console.log(`✅ Created coin history entries for users`);
    console.log(`📊 Migration completed successfully!`);

  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run migration
async function runMigration() {
  console.log('🚀 Starting coin migration...');
  await connectDB();
  await migrateCoins();
}

runMigration();
