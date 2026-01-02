import express from "express";
import { test } from "../controllers/testControllers.js";
import doctorsRoutes from "./doctorsRoutes.js";
import patientsRoutes from "./patientsRoutes.js";
import usersRoutes from "./usersRoutes.js";
import transactionsRoutes from "./transactionsRoutes.js";
import couponsRoutes from "./couponsRoutes.js";
import bookingsRoutes from "./bookingsRoutes.js";
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
router.use("/transactions", transactionsRoutes);
router.use("/coupons", couponsRoutes);
router.use("/bookings", bookingsRoutes);
router.use("/reviews", reviewsRoutes);
router.use("/withdrawals", withdrawalsRoutes);

export default router;
