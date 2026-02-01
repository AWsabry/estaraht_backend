import express from 'express';
import { login, requestPasswordReset, resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);

// Password reset flow
router.post('/request-reset', requestPasswordReset);  // Mobile: get uid & link
router.post('/reset-password', resetPassword);        // Web form: uid + newPassword + confirmPassword

export default router;

