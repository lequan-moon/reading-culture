const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const { authMiddleware, isAdmin } = require('../middleware/auth.middleware');

// Public routes
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);

// Admin only routes
router.post('/', authMiddleware, isAdmin, bookController.createBook);
router.put('/:id', authMiddleware, isAdmin, bookController.updateBook);
router.delete('/:id', authMiddleware, isAdmin, bookController.deleteBook);

// Reading routes
router.get('/:id/read', authMiddleware, bookController.getBookForReading);
router.post('/:id/progress', authMiddleware, bookController.updateReadingProgress);
router.post('/:id/bookmark', authMiddleware, bookController.addBookmark);
router.post('/:id/mood', authMiddleware, bookController.saveMood);

module.exports = router; 