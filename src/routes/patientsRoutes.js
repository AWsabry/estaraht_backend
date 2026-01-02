import express from 'express';
import {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientStats
} from '../controllers/patientsController.js';

const router = express.Router();

// Get all patients
router.get('/', getAllPatients);

// Get patient statistics
router.get('/stats', getPatientStats);

// Get patient by ID
router.get('/:id', getPatientById);

// Create new patient
router.post('/', createPatient);

// Update patient
router.put('/:id', updatePatient);

// Delete patient
router.delete('/:id', deletePatient);

export default router;
