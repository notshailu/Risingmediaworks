const mongoose = require('mongoose');

const workSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  client: {
    type: String,
  },
  image: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
  description: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Work', workSchema);
