import express from 'express';
import {
  getAllBookings,
  getBookingById,
  getBookingsByDoctor,
  getBookingsByPatient,
  createBooking,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
  getBookingStats
} from '../controllers/bookingsController.js';

const router = express.Router();

// Get all bookings
router.get('/', getAllBookings);

// Get booking statistics
router.get('/stats', getBookingStats);

// Get booking by doctor ID
router.get('/doctor/:doctorId', getBookingsByDoctor);

// Get booking by patient ID
router.get('/patient/:patientId', getBookingsByPatient);

// Get booking by ID
router.get('/:id', getBookingById);

// Create new booking
router.post('/', createBooking);

// Update booking status
router.patch('/:id/status', updateBookingStatus);

// Update booking
router.put('/:id', updateBooking);

// Delete booking
router.delete('/:id', deleteBooking);

export default router;
