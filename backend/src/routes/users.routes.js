const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authMiddleware, isAdmin } = require('../middleware/auth.middleware');

// Public routes
router.get('/', authMiddleware, isAdmin, userController.getAllUsers);

// Protected routes (require authentication)
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
router.get('/moods', authMiddleware, userController.getMoods);

// Admin only routes
router.get('/:id', authMiddleware, isAdmin, userController.getUserById);
router.put('/:id', authMiddleware, isAdmin, userController.updateUser);
router.delete('/:id', authMiddleware, isAdmin, userController.deleteUser);

module.exports = router; 