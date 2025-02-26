const mongoose = require('mongoose');
const Book = require('../models/Book.model');
const dotenv = require('dotenv');

dotenv.config();

const sampleBooks = [
  {
    title: "The Magic of Reading",
    author: "John Smith",
    description: "A wonderful journey into the world of books and imagination",
    coverImage: "https://via.placeholder.com/300x400",
    content: "Sample content for the book...",
    ageRange: {
      min: 8,
      max: 12
    },
    genre: ["Adventure", "Educational"],
    readingLevel: "Intermediate",
    pages: [
      {
        content: "Chapter 1: The Beginning... Once upon a time in a magical library, there lived a book that could transport readers to different worlds.",
        imageUrl: "https://via.placeholder.com/800x600",
        audioUrl: "https://example.com/audio1.mp3",
        interactiveElements: [
          {
            type: "Quiz",
            content: {
              type: "dragDrop",
              text: "Complete the sentence: The magical book could ____ readers to ____ worlds.",
              options: ["transport", "different"],
              blanks: 2,
              correctAnswers: ["transport", "different"]
            }
          },
          {
            type: "Quiz",
            content: {
              type: "yesNo",
              question: "Did the story take place in a magical library?",
              correctAnswer: "yes"
            }
          }
        ]
      },
      {
        content: "Chapter 2: The Journey Continues... As our young hero turned the page, the magical book began to glow with a bright, golden light.",
        imageUrl: "https://via.placeholder.com/800x600",
        audioUrl: "https://example.com/audio2.mp3",
        interactiveElements: [
          {
            type: "Quiz",
            content: {
              type: "openQuestion",
              question: "What do you think will happen when the book starts to glow?",
              hint: "Think about what magical things might occur..."
            }
          },
          {
            type: "Quiz",
            content: {
              type: "dragDrop",
              text: "The book glowed with a ____, ____ light.",
              options: ["bright", "golden"],
              blanks: 2,
              correctAnswers: ["bright", "golden"]
            }
          }
        ]
      }
    ]
  },
  {
    title: "Science Adventures",
    author: "Emily Johnson",
    description: "Explore the wonders of science through exciting experiments",
    coverImage: "https://via.placeholder.com/300x400",
    content: "Join us on an exciting journey through science...",
    ageRange: {
      min: 10,
      max: 14
    },
    genre: ["Science", "Educational"],
    readingLevel: "Advanced",
    pages: [
      {
        content: "Chapter 1: The Scientific Method. Scientists follow specific steps to make discoveries and solve problems.",
        imageUrl: "https://via.placeholder.com/800x600",
        audioUrl: "https://example.com/audio3.mp3",
        interactiveElements: [
          {
            type: "Quiz",
            content: {
              type: "dragDrop",
              text: "Scientists follow ____ steps to make ____ and solve problems.",
              options: ["specific", "discoveries"],
              blanks: 2,
              correctAnswers: ["specific", "discoveries"]
            }
          },
          {
            type: "Quiz",
            content: {
              type: "yesNo",
              question: "Is the scientific method important for solving problems?",
              correctAnswer: "yes"
            }
          },
          {
            type: "Quiz",
            content: {
              type: "openQuestion",
              question: "What kind of problem would you like to solve using the scientific method?",
              hint: "Think about a question you've always wanted to answer..."
            }
          }
        ]
      }
    ]
  },
  {
    title: "Bedtime Stories",
    author: "Maria Garcia",
    description: "A collection of soothing bedtime stories for young readers",
    coverImage: "https://via.placeholder.com/300x400",
    content: "Gentle stories to help children wind down...",
    ageRange: {
      min: 5,
      max: 8
    },
    genre: ["Fantasy", "Bedtime"],
    readingLevel: "Beginner",
    pages: [
      {
        content: "The Sleepy Bear: In a cozy cave in the woods, there lived a very sleepy bear who loved to count sheep before bedtime.",
        imageUrl: "https://via.placeholder.com/800x600",
        audioUrl: "https://example.com/audio4.mp3",
        interactiveElements: [
          {
            type: "Quiz",
            content: {
              type: "dragDrop",
              text: "The ____ bear lived in a ____ cave.",
              options: ["sleepy", "cozy"],
              blanks: 2,
              correctAnswers: ["sleepy", "cozy"]
            }
          },
          {
            type: "Quiz",
            content: {
              type: "yesNo",
              question: "Did the bear count sheep before bedtime?",
              correctAnswer: "yes"
            }
          },
          {
            type: "Quiz",
            content: {
              type: "openQuestion",
              question: "What helps you fall asleep at night?",
              hint: "Think about things that make you feel sleepy..."
            }
          }
        ]
      }
    ]
  }
];

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await Book.deleteMany({}); // Clear existing books
    await Book.insertMany(sampleBooks);
    console.log('Sample books added successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
  }); 