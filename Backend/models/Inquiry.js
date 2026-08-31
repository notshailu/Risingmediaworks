const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  company: {
    type: String
  },
  projectType: {
    type: String,
    default: 'General Project Enquiry'
  },
  details: {
    type: String
  },
  status: {
    type: String,
    default: 'New'
  }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
