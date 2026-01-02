import { supabase } from '../config/supabase.js';

// Get all admin users
export const getAllUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data,
      count: data?.length || 0
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// Create new admin user
export const createUser = async (req, res) => {
  try {
    const userData = req.body;

    const { data, error } = await supabase
      .from('admin_users')
      .insert([userData])
      .select();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('admin_users')
      .update(updates)
      .eq('user_id', id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('user_id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

// Get user statistics
export const getUserStats = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('status');

    if (error) throw error;

    const stats = {
      totalUsers: data?.length || 0,
      activeUsers: data?.filter(u => u.status === 'active').length || 0,
      inactiveUsers: data?.filter(u => u.status !== 'active').length || 0
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
      error: error.message
    });
  }
};
