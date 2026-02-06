import { supabase } from '../config/supabase.js';

// Get all payment plans
export const getAllPaymentPlans = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('payment_plans')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    console.error('Error fetching payment plans:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment plans',
      error: error.message,
    });
  }
};

// Get payment plan by ID
export const getPaymentPlanById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('payment_plans')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Payment plan not found',
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching payment plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment plan',
      error: error.message,
    });
  }
};

// Create payment plan
export const createPaymentPlan = async (req, res) => {
  try {
    const planData = req.body;

    const { data, error } = await supabase
      .from('payment_plans')
      .insert([planData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Payment plan created successfully',
      data,
    });
  } catch (error) {
    console.error('Error creating payment plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment plan',
      error: error.message,
    });
  }
};

// Update payment plan
export const updatePaymentPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('payment_plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Payment plan not found',
      });
    }

    res.json({
      success: true,
      message: 'Payment plan updated successfully',
      data,
    });
  } catch (error) {
    console.error('Error updating payment plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating payment plan',
      error: error.message,
    });
  }
};

// Delete payment plan
export const deletePaymentPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from('payment_plans').delete().eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Payment plan deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting payment plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting payment plan',
      error: error.message,
    });
  }
};

// Get payment plan stats
export const getPaymentPlanStats = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('payment_plans')
      .select('id, is_active');

    if (error) throw error;

    const plans = data || [];
    const totalPlans = plans.length;
    const activePlans = plans.filter((p) => p.is_active === true).length;

    res.json({
      success: true,
      data: {
        totalPlans,
        activePlans,
      },
    });
  } catch (error) {
    console.error('Error fetching payment plan stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment plan stats',
      error: error.message,
    });
  }
};
