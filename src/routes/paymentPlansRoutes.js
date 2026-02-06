import express from 'express';
import {
  getAllPaymentPlans,
  getPaymentPlanById,
  createPaymentPlan,
  updatePaymentPlan,
  deletePaymentPlan,
  getPaymentPlanStats,
} from '../controllers/paymentPlansController.js';

const router = express.Router();

router.get('/', getAllPaymentPlans);
router.get('/stats', getPaymentPlanStats);
router.get('/:id', getPaymentPlanById);
router.post('/', createPaymentPlan);
router.put('/:id', updatePaymentPlan);
router.delete('/:id', deletePaymentPlan);

export default router;
