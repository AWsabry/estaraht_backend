import express from "express";
import { test } from "../controllers/testControllers.js";
import doctorsRoutes from "./doctorsRoutes.js";
import patientsRoutes from "./patientsRoutes.js";
import usersRoutes from "./usersRoutes.js";
import couponsRoutes from "./couponsRoutes.js";
import paymentPlansRoutes from "./paymentPlansRoutes.js";
import patientPlanSubscriptionsRoutes from "./patientPlanSubscriptionsRoutes.js";
import bookingsRoutes from "./bookingsRoutes.js";
import availabilitiesRoutes from "./availabilitiesRoutes.js";
import reviewsRoutes from "./reviewsRoutes.js";
import withdrawalsRoutes from "./withdrawalsRoutes.js";
import authRoutes from "./authRoutes.js";

const router = express.Router();

// Test endpoint
router.get("/test", test);

// Auth routes
router.use("/auth", authRoutes);

// Dashboard routes
router.use("/doctors", doctorsRoutes);
router.use("/patients", patientsRoutes);
router.use("/users", usersRoutes);
router.use("/coupons", couponsRoutes);
router.use("/payment-plans", paymentPlansRoutes);
router.use("/patient-plan-subscriptions", patientPlanSubscriptionsRoutes);
router.use("/bookings", bookingsRoutes);
router.use("/availabilities", availabilitiesRoutes);
router.use("/reviews", reviewsRoutes);
router.use("/withdrawals", withdrawalsRoutes);

export default router;
