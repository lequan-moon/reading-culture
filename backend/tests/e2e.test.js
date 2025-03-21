const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User.model');
const Book = require('../src/models/Book.model');

let token;
let bookId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  // Clear test database
  await User.deleteMany({});
  await Book.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth API', () => {
  test('Register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
  });

  test('Login with registered user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
    token = response.body.token; // Save token for subsequent tests
  });
});

describe('User API', () => {
  test('Get user profile', async () => {
    const response = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe('testuser@example.com');
  });

  test('Update user profile', async () => {
    const response = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: 'updateduser',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe('updateduser');
  });

  test('Get all users (admin only)', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(403); // Assuming the test user is not an admin
  });
});

describe('Book API', () => {
  const testBook = {
    title: 'Test Book',
    author: 'Test Author',
    description: 'Test Description',
    coverImage: 'https://via.placeholder.com/300x400',
    content: 'Test Content',
    ageRange: { min: 8, max: 12 },
    genre: ['Adventure'],
    readingLevel: 'Intermediate',
    pages: [{
      content: 'Test Page Content',
      imageUrl: 'https://via.placeholder.com/800x600',
      audioUrl: 'https://example.com/audio.mp3',
      interactiveElements: []
    }]
  };

  test('Get all books', async () => {
    const response = await request(app)
      .get('/api/books');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('Create a new book (admin only)', async () => {
    const response = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${token}`)
      .send(testBook);
    expect(response.statusCode).toBe(403); // Assuming the test user is not an admin
  });

  test('Create test book in database', async () => {
    // Directly create a book in the database for testing
    const book = new Book(testBook);
    const savedBook = await book.save();
    bookId = savedBook._id;
    expect(savedBook._id).toBeDefined();
  });

  test('Get book by ID', async () => {
    const response = await request(app)
      .get(`/api/books/${bookId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe('Test Book');
  });

  test('Update book (admin only)', async () => {
    const response = await request(app)
      .put(`/api/books/${bookId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Test Book',
      });
    expect(response.statusCode).toBe(403); // Assuming the test user is not an admin
  });

  test('Delete book (admin only)', async () => {
    const response = await request(app)
      .delete(`/api/books/${bookId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(403); // Assuming the test user is not an admin
  });
});
