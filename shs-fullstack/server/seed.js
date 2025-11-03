const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Notice = require('./models/Notice');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Notice.deleteMany({});

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@shs.edu.in',
      password: hashedPassword,
      rollNumber: 'ADMIN001',
      branch: 'CSE',
      role: 'admin',
      isVerified: true
    });

    // Create sample notices
    const notices = [
      {
        title: 'Mid-Semester Exam Schedule',
        description: 'Mid-semester examinations will be conducted from 15th to 20th December 2025.',
        category: 'Exam',
        branch: 'All',
        postedBy: admin._id,
        priority: 'High'
      },
      {
        title: 'Workshop on AI and Machine Learning',
        description: 'A workshop on AI/ML will be organized by CSE department on 10th December.',
        category: 'Event',
        branch: 'CSE',
        postedBy: admin._id,
        priority: 'Medium'
      }
    ];

    await Notice.insertMany(notices);

    console.log('✅ Database seeded successfully!');
    console.log('Admin credentials: admin@shs.edu.in / admin123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
