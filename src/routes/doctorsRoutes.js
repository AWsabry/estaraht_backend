import express from 'express';
import {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorStats
} from '../controllers/doctorsController.js';

const router = express.Router();

// Get all doctors
router.get('/', getAllDoctors);

// Get doctor statistics
router.get('/stats', getDoctorStats);

// Get doctor by ID
router.get('/:id', getDoctorById);

// Create new doctor
router.post('/', createDoctor);

// Update doctor
router.put('/:id', updateDoctor);

// Delete doctor
router.delete('/:id', deleteDoctor);

export default router;
