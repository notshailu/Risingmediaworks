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
  buyUrl: {
    type: String, // Purchasing Link (e.g. Amazon URL)
  },
  category: {
    type: String, // Category e.g. academic-books, technical-books
  },
  printSpecs: {
    type: String, // Format Specs e.g. 7x10 inch print, white paperweight
  },
  gridSpec: {
    type: String, // Grid Layout spec
  },
  publishingSpec: {
    type: String, // Publishing spec
  },
  paperSpec: {
    type: String, // Paper & Finish spec
  },
  finalBookUrl: {
    type: String, // High-Res / PDF link
  }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
