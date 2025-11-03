const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['General', 'Academic', 'Event', 'Exam', 'Holiday', 'Urgent'] },
  branch: { type: String, enum: ['All', 'CSE', 'ECE', 'ME', 'CE', 'EE'], default: 'All' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  attachments: [{ filename: String, url: String }],
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  expiryDate: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
