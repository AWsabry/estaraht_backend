import express from 'express';
import {
  getAllSubscriptions,
  getSubscriptionById,
  getSubscriptionsByPatient,
  getSubscriptionsByPlan,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getSubscriptionStats,
} from '../controllers/patientPlanSubscriptionsController.js';

const router = express.Router();

router.get('/', getAllSubscriptions);
router.get('/stats', getSubscriptionStats);
router.get('/patient/:patientId', getSubscriptionsByPatient);
router.get('/plan/:planId', getSubscriptionsByPlan);
router.get('/:id', getSubscriptionById);
router.post('/', createSubscription);
router.put('/:id', updateSubscription);
router.delete('/:id', deleteSubscription);

export default router;
