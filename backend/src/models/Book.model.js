const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  imageUrl: String,
  audioUrl: String,
  interactiveElements: [{
    type: {
      type: String,
      enum: ['Quiz', 'Video', 'Audio', 'Game'],
      required: true
    },
    content: mongoose.Schema.Types.Mixed
  }]
});

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  ageRange: {
    min: {
      type: Number,
      required: true,
      min: 5,
      max: 18
    },
    max: {
      type: Number,
      required: true,
      min: 5,
      max: 18
    }
  },
  genre: [{
    type: String,
    required: true
  }],
  readingLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  pages: [pageSchema],
  readingProgress: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    currentPage: {
      type: Number,
      default: 0
    },
    lastReadAt: {
      type: Date,
      default: Date.now
    },
    bookmarks: [{
      page: Number,
      note: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    completedInteractives: [{
      elementId: mongoose.Schema.Types.ObjectId,
      completedAt: {
        type: Date,
        default: Date.now
      },
      score: Number
    }]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Book', bookSchema); 