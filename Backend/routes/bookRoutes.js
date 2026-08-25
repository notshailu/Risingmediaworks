const express = require('express');
const router = express.Router();
const upload = require('../config/cloudinary');
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');

router.route('/')
  .get(getBooks)
  .post(upload.single('coverImage'), createBook);

router.route('/:id')
  .get(getBookById)
  .put(upload.single('coverImage'), updateBook)
  .delete(deleteBook);

module.exports = router;
