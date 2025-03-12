const mongoose = require('mongoose');
const { User, Cabin } = require('../models');
const { logger } = require('./logger');

// Load environment variables
require('dotenv').config();

// MongoDB connection string
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/familycabin';

// Connect to MongoDB
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Seed data
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Cabin.deleteMany({});
    
    logger.info('Database cleared');
    
    // Create global admin user
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@familycabin.io',
      password: 'admin', // This will be hashed by the pre-save hook
      name: 'Global Admin',
      address: 'System',
      bio: 'System administrator',
      role: 'GLOBAL_ADMIN',
    });
    
    logger.info(`Created global admin user: ${adminUser.username}`);
    
    // Create sample cabins
    const cabins = [
      {
        name: 'Pine Lake Retreat',
        description: 'A beautiful cabin nestled in the woods by Pine Lake. Perfect for family gatherings and outdoor activities.',
        location: 'Pine Lake, Washington',
        image: '/images/cabins/pine-lake.jpg',
        createdBy: adminUser._id,
        members: [{ userId: adminUser._id, role: 'ADMIN' }],
      },
      {
        name: 'Mountain View Lodge',
        description: 'Spectacular mountain views from this spacious lodge. Hiking trails nearby and plenty of room for the whole family.',
        location: 'Blue Ridge Mountains, North Carolina',
        image: '/images/cabins/mountain-view.jpg',
        createdBy: adminUser._id,
        members: [{ userId: adminUser._id, role: 'ADMIN' }],
      },
    ];
    
    const createdCabins = await Cabin.insertMany(cabins);
    
    // Add cabins to admin user
    const cabinRefs = createdCabins.map(cabin => ({
      cabinId: cabin._id,
      role: 'ADMIN',
    }));
    
    await User.findByIdAndUpdate(
      adminUser._id,
      { $push: { cabins: { $each: cabinRefs } } }
    );
    
    logger.info(`Created ${createdCabins.length} sample cabins`);
    
    logger.info('Database seeded successfully');
    
    process.exit(0);
  } catch (err) {
    logger.error(`Error seeding database: ${err.message}`);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
