import { supabase } from '../config/supabase.js';

// Get all patient plan subscriptions
export const getAllSubscriptions = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('patient_plan_subscriptions')
      .select(`
        *,
        patients(id, name, email, phone),
        payment_plans(id, plan_name, plan_name_ar, price, sessions, is_active)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    console.error('Error fetching patient plan subscriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patient plan subscriptions',
      error: error.message,
    });
  }
};

// Get subscription by ID
export const getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('patient_plan_subscriptions')
      .select(`
        *,
        patients(id, name, email, phone, profile_img_url),
        payment_plans(id, plan_name, plan_name_ar, price, sessions, is_active)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription',
      error: error.message,
    });
  }
};

// Get subscriptions by patient ID
export const getSubscriptionsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const { data, error } = await supabase
      .from('patient_plan_subscriptions')
      .select(`
        *,
        payment_plans(id, plan_name, plan_name_ar, price, sessions)
      `)
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    console.error('Error fetching subscriptions by patient:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscriptions',
      error: error.message,
    });
  }
};

// Get subscriptions by payment plan ID
export const getSubscriptionsByPlan = async (req, res) => {
  try {
    const { planId } = req.params;

    const { data, error } = await supabase
      .from('patient_plan_subscriptions')
      .select(`
        *,
        patients(id, name, email, phone)
      `)
      .eq('plan_id', planId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    console.error('Error fetching subscriptions by plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscriptions',
      error: error.message,
    });
  }
};

// Create subscription
export const createSubscription = async (req, res) => {
  try {
    const subData = req.body;

    const { data, error } = await supabase
      .from('patient_plan_subscriptions')
      .insert([subData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      data,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating subscription',
      error: error.message,
    });
  }
};

// Update subscription
export const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('patient_plan_subscriptions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    res.json({
      success: true,
      message: 'Subscription updated successfully',
      data,
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating subscription',
      error: error.message,
    });
  }
};

// Delete subscription
export const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('patient_plan_subscriptions')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Subscription deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting subscription',
      error: error.message,
    });
  }
};

// Get subscription stats
export const getSubscriptionStats = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('patient_plan_subscriptions')
      .select('id, status');

    if (error) throw error;

    const subs = data || [];
    const totalSubscriptions = subs.length;
    const activeSubscriptions = subs.filter(
      (s) => s.status === 'active' || s.status === 'trialing'
    ).length;
    const expiredSubscriptions = subs.filter((s) => s.status === 'expired').length;

    res.json({
      success: true,
      data: {
        totalSubscriptions,
        activeSubscriptions,
        expiredSubscriptions,
      },
    });
  } catch (error) {
    console.error('Error fetching subscription stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription stats',
      error: error.message,
    });
  }
};
