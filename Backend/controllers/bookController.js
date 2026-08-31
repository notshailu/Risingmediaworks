const Book = require('../models/Book');

// @desc    Get all books
// @route   GET /api/books
const getBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single book
// @route   GET /api/books/:id
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a book
// @route   POST /api/books
const createBook = async (req, res) => {
  const {
    title,
    author,
    description,
    price,
    buyUrl,
    category,
    printSpecs,
    gridSpec,
    publishingSpec,
    paperSpec,
    finalBookUrl
  } = req.body;
  let coverImage = req.body.coverImage; // Fallback to URL if provided

  if (req.file) {
    coverImage = req.file.path; // Cloudinary secure URL
  }

  try {
    const book = new Book({
      title,
      author,
      description,
      price,
      coverImage,
      buyUrl,
      category,
      printSpecs,
      gridSpec,
      publishingSpec,
      paperSpec,
      finalBookUrl
    });

    const createdBook = await book.save();
    res.status(201).json(createdBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
const updateBook = async (req, res) => {
  const {
    title,
    author,
    description,
    price,
    buyUrl,
    category,
    printSpecs,
    gridSpec,
    publishingSpec,
    paperSpec,
    finalBookUrl
  } = req.body;
  let coverImage = req.body.coverImage;

  if (req.file) {
    coverImage = req.file.path; // New uploaded image URL
  }

  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      book.title = title !== undefined ? title : book.title;
      book.author = author !== undefined ? author : book.author;
      book.description = description !== undefined ? description : book.description;
      book.price = price !== undefined ? price : book.price;
      book.buyUrl = buyUrl !== undefined ? buyUrl : book.buyUrl;
      book.category = category !== undefined ? category : book.category;
      book.printSpecs = printSpecs !== undefined ? printSpecs : book.printSpecs;
      book.gridSpec = gridSpec !== undefined ? gridSpec : book.gridSpec;
      book.publishingSpec = publishingSpec !== undefined ? publishingSpec : book.publishingSpec;
      book.paperSpec = paperSpec !== undefined ? paperSpec : book.paperSpec;
      book.finalBookUrl = finalBookUrl !== undefined ? finalBookUrl : book.finalBookUrl;
      if (coverImage) book.coverImage = coverImage;

      const updatedBook = await book.save();
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      await book.deleteOne();
      res.json({ message: 'Book removed' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};
