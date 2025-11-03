const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  subject: { type: String, required: true },
  branch: { type: String, required: true, enum: ['CSE', 'ECE', 'ME', 'CE', 'EE'] },
  semester: { type: Number, required: true, min: 1, max: 8 },
  type: { type: String, required: true, enum: ['Notes', 'Assignment', 'PYQ', 'Reference', 'Book', 'Other'] },
  fileUrl: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  downloads: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);
