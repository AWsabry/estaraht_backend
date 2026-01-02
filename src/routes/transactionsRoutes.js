import express from 'express';
import {
  getAllTransactions,
  getTransactionsHistory,
  getPaymentHistory,
  getTransactionById,
  getTransactionStats,
  getTransactionsByDoctor,
  getTransactionsByPatient
} from '../controllers/transactionsController.js';

const router = express.Router();

// Get all transactions (combined)
router.get('/', getAllTransactions);

// Get transaction statistics
router.get('/stats', getTransactionStats);

// Get transactions history only
router.get('/history', getTransactionsHistory);

// Get payment history only
router.get('/payments', getPaymentHistory);

// Get transactions by doctor ID
router.get('/doctor/:doctorId', getTransactionsByDoctor);

// Get transactions by patient ID
router.get('/patient/:patientId', getTransactionsByPatient);

// Get transaction by ID
router.get('/:id', getTransactionById);

export default router;
