const mongoose = require('mongoose');

const adminTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  deviceInfo: {
    type: String,
    default: 'Unknown Device'
  },
  role: {
    type: String,
    default: 'admin'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('AdminToken', adminTokenSchema);
