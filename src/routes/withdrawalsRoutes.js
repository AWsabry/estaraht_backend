import express from 'express';
import {
  getAllWithdrawals,
  getWithdrawalById,
  getWithdrawalsByDoctor,
  createWithdrawal,
  updateWithdrawal,
  deleteWithdrawal,
  getWithdrawalStats
} from '../controllers/withdrawalsController.js';

const router = express.Router();

// Get all withdrawals
router.get('/', getAllWithdrawals);

// Get withdrawal statistics
router.get('/stats', getWithdrawalStats);

// Get withdrawals by doctor ID
router.get('/doctor/:doctorId', getWithdrawalsByDoctor);

// Get withdrawal by ID
router.get('/:id', getWithdrawalById);

// Create new withdrawal
router.post('/', createWithdrawal);

// Update withdrawal
router.put('/:id', updateWithdrawal);

// Delete withdrawal
router.delete('/:id', deleteWithdrawal);

export default router;

