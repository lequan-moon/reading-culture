const mongoose = require('mongoose');
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const sampleUsers = [
  {
    username: 'admin_user',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    username: 'student_user',
    email: 'student@example.com',
    password: 'student123',
    role: 'student'
  },
  {
    username: 'parent_user',
    email: 'parent@example.com',
    password: 'parent123',
    role: 'parent'
  },
  {
    username: 'staff_user',
    email: 'staff@example.com',
    password: 'staff123',
    role: 'staff'
  }
];

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Clear existing users
    await User.deleteMany({});
    
    // Hash passwords and create users
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    );
    
    await User.insertMany(hashedUsers);
    console.log('Sample users added successfully:');
    console.log('----------------------------------------');
    sampleUsers.forEach(user => {
      console.log(`Role: ${user.role}`);
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log('----------------------------------------');
    });
    
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
  }); 