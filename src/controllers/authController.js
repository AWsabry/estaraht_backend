import { supabase } from '../config/supabase.js';
import admin from '../config/firebase.js';

// Helper: find user by email (doctor or patient)
const findUserByEmail = async (email) => {
  const { data: doctor } = await supabase
    .from('doctors')
    .select('doctor_id, email, full_name')
    .eq('email', email)
    .single();

  if (doctor) return { user: doctor, type: 'doctor', uid: doctor.doctor_id };

  const { data: patient } = await supabase
    .from('patients')
    .select('id, email, name')
    .eq('email', email)
    .single();

  if (patient) return { user: patient, type: 'patient', uid: patient.id };

  return null;
};

// Login admin user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const { data: user, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('role', 'admin')
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user exists and password matches
    // Note: In production, passwords should be hashed (e.g., using bcrypt)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account is not active'
      });
    }

    // Update last login
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('user_id', user.user_id);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};

// 1. Request password reset (called by mobile) - returns uid for building reset link
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const userInfo = await findUserByEmail(email);

    if (!userInfo) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userName = userInfo.type === 'doctor' ? userInfo.user.full_name : userInfo.user.name;
    const baseUrl = process.env.DASHBOARD_URL || 'https://dashboard.estaraht.com';
    const resetLink = `${baseUrl}/reset-password?uid=${userInfo.uid}`;

    console.log(`🔐 Password reset requested for ${email} (${userInfo.type})`);

    res.json({
      success: true,
      message: 'Password reset requested',
      data: {
        uid: userInfo.uid,
        email,
        userType: userInfo.type,
        userName: userName || email,
        resetLink
      }
    });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing request',
      error: error.message
    });
  }
};

// 2. Reset password (called from web form) - uses uid from link + newPassword + confirmPassword
export const resetPassword = async (req, res) => {
  try {
    const { uid, newPassword, confirmPassword } = req.body;

    if (!uid || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'UID, new password, and confirm password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password and confirm password do not match'
      });
    }

    await admin.auth().updateUser(uid, { password: newPassword });

    console.log(`✅ Password reset successful for uid: ${uid}`);

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Error resetting password:', error);

    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({
        success: false,
        message: 'Invalid or expired reset link'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: error.message
    });
  }
};

