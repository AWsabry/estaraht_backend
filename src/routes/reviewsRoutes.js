import express from 'express';
import {
  getAllReviews,
  getReviewById,
  getReviewsByBookingId,
  getReviewsByDoctorId,
  getReviewsByPatientId,
  createReview,
  updateReview,
  deleteReview,
  getReviewStats
} from '../controllers/reviewsController.js';

const router = express.Router();

// Get all reviews
router.get('/', getAllReviews);

// Get review statistics
router.get('/stats', getReviewStats);

// Get reviews by booking ID
router.get('/booking/:bookingId', getReviewsByBookingId);

// Get reviews by doctor ID
router.get('/doctor/:doctorId', getReviewsByDoctorId);

// Get reviews by patient ID
router.get('/patient/:patientId', getReviewsByPatientId);

// Get review by ID
router.get('/:id', getReviewById);

// Create new review
router.post('/', createReview);

// Update review
router.put('/:id', updateReview);

// Delete review
router.delete('/:id', deleteReview);

export default router;

