import express from 'express';
import {
  getAllAvailabilities,
  getAvailabilitiesByDoctor,
  getAvailabilityById,
  createAvailability,
  updateAvailability,
  deleteAvailability,
} from '../controllers/availabilitiesController.js';

const router = express.Router();

router.get('/', getAllAvailabilities);
router.get('/doctor/:doctorId', getAvailabilitiesByDoctor);
router.get('/:id', getAvailabilityById);
router.post('/', createAvailability);
router.put('/:id', updateAvailability);
router.delete('/:id', deleteAvailability);

export default router;
