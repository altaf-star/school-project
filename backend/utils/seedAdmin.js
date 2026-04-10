const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: require('path').join(__dirname, '..', '.env') });

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Remove old admin and create/update with new credentials
    await User.deleteOne({ email: 'admin@school.com' });
    await User.deleteOne({ email: 'mahi@gmail.com' });
    await User.create({
      email: 'mahi@gmail.com',
      password: 'MahiSchool2026',
      role: 'admin',
    });
    console.log('Admin user created: mahi@gmail.com / MahiSchool2026');

    const existingPrincipal = await User.findOne({ email: 'principal@school.com' });
    if (existingPrincipal) {
      console.log('Principal user already exists');
    } else {
      await User.create({
        email: 'principal@school.com',
        password: 'principal123',
        role: 'principal',
      });
      console.log('Principal user created: principal@school.com / principal123');
    }

    await mongoose.disconnect();
    console.log('Done.');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
}

seed();
