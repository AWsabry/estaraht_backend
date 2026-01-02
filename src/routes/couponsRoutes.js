import express from 'express';
import {
  getAllCoupons,
  getCouponById,
  getCouponByCode,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  useCoupon,
  getCouponStats
} from '../controllers/couponsController.js';

const router = express.Router();

// Get all coupons
router.get('/', getAllCoupons);

// Get coupon statistics
router.get('/stats', getCouponStats);

// Validate coupon
router.post('/validate/:code', validateCoupon);

// Get coupon by code
router.get('/code/:code', getCouponByCode);

// Use/redeem coupon
router.post('/:id/use', useCoupon);

// Get coupon by ID
router.get('/:id', getCouponById);

// Create new coupon
router.post('/', createCoupon);

// Update coupon
router.put('/:id', updateCoupon);

// Delete coupon
router.delete('/:id', deleteCoupon);

export default router;
