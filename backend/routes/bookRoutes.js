const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Create book
router.post(
  '/',
  auth,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'file', maxCount: 1 }
  ]),
  bookController.addBook
);

// Get all books
router.get('/', auth, bookController.getBooks);

// ✅ Get single book by ID
router.get('/:id', auth, bookController.getBook);

// Update book
router.put(
  '/:id',
  auth,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'file', maxCount: 1 }
  ]),
  bookController.updateBook
);

// Delete book
router.delete('/:id', auth, bookController.deleteBook);
module.exports = router;
