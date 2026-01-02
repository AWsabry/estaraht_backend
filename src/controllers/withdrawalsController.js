import { supabase } from '../config/supabase.js';

// Get all withdrawals
export const getAllWithdrawals = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('withdraws')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    console.log("Withdrawals fetched:", data?.length || 0);

    res.json({
      success: true,
      data: data || [],
      count: data?.length || 0
    });
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching withdrawals',
      error: error.message
    });
  }
};

// Get withdrawal by ID
export const getWithdrawalById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('withdraws')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal not found'
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching withdrawal:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching withdrawal',
      error: error.message
    });
  }
};

// Get withdrawals by doctor ID
export const getWithdrawalsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const { data, error } = await supabase
      .from('withdraws')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: data || [],
      count: data?.length || 0
    });
  } catch (error) {
    console.error('Error fetching doctor withdrawals:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor withdrawals',
      error: error.message
    });
  }
};

// Create new withdrawal
export const createWithdrawal = async (req, res) => {
  try {
    const {
      doctor_id,
      total_amount,
      total_actual_amount,
      withrowl_history,
      income_history,
      action_type,
      operation_status,
      payment_date
    } = req.body;

    const { data, error } = await supabase
      .from('withdraws')
      .insert({
        doctor_id,
        total_amount,
        total_actual_amount,
        withrowl_history,
        income_history,
        action_type,
        operation_status,
        payment_date: payment_date || new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data,
      message: 'Withdrawal created successfully'
    });
  } catch (error) {
    console.error('Error creating withdrawal:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating withdrawal',
      error: error.message
    });
  }
};

// Update withdrawal
export const updateWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      doctor_id,
      total_amount,
      total_actual_amount,
      withrowl_history,
      income_history,
      action_type,
      operation_status,
      payment_date
    } = req.body;

    const { data, error } = await supabase
      .from('withdraws')
      .update({
        doctor_id,
        total_amount,
        total_actual_amount,
        withrowl_history,
        income_history,
        action_type,
        operation_status,
        payment_date
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal not found'
      });
    }

    res.json({
      success: true,
      data,
      message: 'Withdrawal updated successfully'
    });
  } catch (error) {
    console.error('Error updating withdrawal:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating withdrawal',
      error: error.message
    });
  }
};

// Delete withdrawal
export const deleteWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('withdraws')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Withdrawal deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting withdrawal:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting withdrawal',
      error: error.message
    });
  }
};

// Get withdrawal statistics
export const getWithdrawalStats = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('withdraws')
      .select('total_amount, total_actual_amount, operation_status');

    if (error) throw error;

    const withdrawals = data || [];
    
    const totalAmount = withdrawals.reduce((sum, w) => {
      const amount = parseFloat(w.total_amount) || 0;
      return sum + amount;
    }, 0);

    const totalActualAmount = withdrawals.reduce((sum, w) => {
      const amount = parseFloat(w.total_actual_amount) || 0;
      return sum + amount;
    }, 0);

    const stats = {
      totalWithdrawals: withdrawals.length,
      totalAmount,
      totalActualAmount,
      successfulWithdrawals: withdrawals.filter(w => w.operation_status === 'success').length,
      pendingWithdrawals: withdrawals.filter(w => w.operation_status === 'waiting' || w.operation_status === 'pending').length,
      failedWithdrawals: withdrawals.filter(w => w.operation_status === 'failed').length
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching withdrawal stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching withdrawal statistics',
      error: error.message
    });
  }
};

