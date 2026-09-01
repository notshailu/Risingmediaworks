const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: 'Rising Media Admin',
  },
  role: {
    type: String,
    default: 'superadmin',
  },
  lastLogin: {
    type: Date,
  }
}, { timestamps: true });

module.exports = mongoose.model('AdminUser', adminUserSchema);
