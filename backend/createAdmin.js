// ...existing code...
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bookstore';
  await mongoose.connect(uri);

  const email = 'admin@example.com';

  // remove any existing admin with this email to avoid double-hash issues
  await User.deleteMany({ email });

  // create admin with plain password — User model will hash it in pre('save')
  const admin = await User.create({
    name: 'Admin',
    email,
    password: 'admin123',
    role: 'admin'
  });

  console.log('Admin created:', admin.email, '(password: admin123)');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
// ...existing code...