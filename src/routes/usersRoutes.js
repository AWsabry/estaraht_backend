import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} from '../controllers/usersController.js';

const router = express.Router();

// Get all users
router.get('/', getAllUsers);

// Get user statistics
router.get('/stats', getUserStats);

// Get user by ID
router.get('/:id', getUserById);

// Create new user
router.post('/', createUser);

// Update user
router.put('/:id', updateUser);

// Delete user
router.delete('/:id', deleteUser);

export default router;
