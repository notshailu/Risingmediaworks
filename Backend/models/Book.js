const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  coverImage: {
    type: String, // URL to the image
  },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
