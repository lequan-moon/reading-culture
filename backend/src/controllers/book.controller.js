const Book = require('../models/Book.model');
const User = require('../models/User.model');

const bookController = {
  // Get all books with filtering
  getAllBooks: async (req, res) => {
    try {
      const {
        ageRange,
        genre,
        readingLevel,
        search
      } = req.query;

      let query = {};

      if (ageRange) {
        query['ageRange.min'] = { $lte: parseInt(ageRange) };
        query['ageRange.max'] = { $gte: parseInt(ageRange) };
      }

      if (genre) {
        query.genre = { $in: genre.split(',') };
      }

      if (readingLevel) {
        query.readingLevel = readingLevel;
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      const books = await Book.find(query)
        .sort({ createdAt: -1 });

      res.json(books);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get single book by ID
  getBookById: async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.json(book);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create new book (Admin only)
  createBook: async (req, res) => {
    try {
      const newBook = new Book(req.body);
      const savedBook = await newBook.save();
      res.status(201).json(savedBook);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update book (Admin only)
  updateBook: async (req, res) => {
    try {
      const updatedBook = await Book.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: Date.now() },
        { new: true }
      );
      if (!updatedBook) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.json(updatedBook);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete book (Admin only)
  deleteBook: async (req, res) => {
    try {
      const deletedBook = await Book.findByIdAndDelete(req.params.id);
      if (!deletedBook) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.json({ message: 'Book deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get book for reading
  getBookForReading: async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      // Get user's reading progress
      const progress = book.readingProgress.find(
        p => p.userId.toString() === req.user.userId
      );

      res.json({
        ...book.toObject(),
        currentProgress: progress || { currentPage: 0 }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update reading progress
  updateReadingProgress: async (req, res) => {
    try {
      const { currentPage } = req.body;
      const book = await Book.findById(req.params.id);

      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      const progressIndex = book.readingProgress.findIndex(
        p => p.userId.toString() === req.user.userId
      );

      if (progressIndex === -1) {
        book.readingProgress.push({
          userId: req.user.userId,
          currentPage,
          lastReadAt: new Date()
        });
      } else {
        book.readingProgress[progressIndex].currentPage = currentPage;
        book.readingProgress[progressIndex].lastReadAt = new Date();
      }

      await book.save();
      res.json({ message: 'Progress updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Add bookmark
  addBookmark: async (req, res) => {
    try {
      const { page, note } = req.body;
      const book = await Book.findById(req.params.id);

      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      const progressIndex = book.readingProgress.findIndex(
        p => p.userId.toString() === req.user.userId
      );

      if (progressIndex === -1) {
        book.readingProgress.push({
          userId: req.user.userId,
          bookmarks: [{ page, note }]
        });
      } else {
        book.readingProgress[progressIndex].bookmarks.push({ page, note });
      }

      await book.save();
      res.json({ message: 'Bookmark added successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  completeInteractive: async (req, res) => {
    try {
      const { elementId, score } = req.body;
      const book = await Book.findById(req.params.id);

      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      const progressIndex = book.readingProgress.findIndex(
        p => p.userId.toString() === req.user.userId
      );

      if (progressIndex === -1) {
        book.readingProgress.push({
          userId: req.user.userId,
          completedInteractives: [{
            elementId,
            score,
            completedAt: new Date()
          }]
        });
      } else {
        book.readingProgress[progressIndex].completedInteractives.push({
          elementId,
          score,
          completedAt: new Date()
        });
      }

      await book.save();
      res.json({ message: 'Interactive element completed successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  saveMood: async (req, res) => {
    try {
      const { pageNumber, mood } = req.body;
      const book = await Book.findById(req.params.id);
      let user = await User.findById(req.user.userId);

      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Initialize bookMoods array if it doesn't exist
      if (!user.bookMoods) {
        user.bookMoods = [];
      }

      // Save mood in Book
      const progressIndex = book.readingProgress.findIndex(
        p => p.userId.toString() === req.user.userId
      );

      if (progressIndex === -1) {
        book.readingProgress.push({
          userId: req.user.userId,
          moods: [{
            pageNumber,
            mood,
            timestamp: new Date()
          }]
        });
      } else {
        if (!book.readingProgress[progressIndex].moods) {
          book.readingProgress[progressIndex].moods = [];
        }
        book.readingProgress[progressIndex].moods.push({
          pageNumber,
          mood,
          timestamp: new Date()
        });
      }

      // Save mood in User
      const bookMoodIndex = user.bookMoods.findIndex(
        bm => bm.bookId.toString() === req.params.id
      );

      if (bookMoodIndex === -1) {
        user.bookMoods.push({
          bookId: req.params.id,
          moods: [{
            mood,
            timestamp: new Date()
          }]
        });
      } else {
        user.bookMoods[bookMoodIndex].moods.push({
          mood,
          timestamp: new Date()
        });
      }

      await Promise.all([book.save(), user.save()]);
      res.json({ message: 'Mood saved successfully' });
    } catch (error) {
      console.error('Error saving mood:', error);
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = bookController; 