const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  rollNumber: { type: String, required: true, unique: true },
  branch: { type: String, required: true, enum: ['CSE', 'ECE', 'ME', 'CE', 'EE'] },
  role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
