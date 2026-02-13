import { supabase } from '../config/supabase.js';

// Get all coupons
export const getAllCoupons = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('coupon')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data,
      count: data?.length || 0
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching coupons',
      error: error.message
    });
  }
};

// Get coupon by ID
export const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('coupon')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching coupon',
      error: error.message
    });
  }
};

// Get coupon by code
export const getCouponByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const { data, error } = await supabase
      .from('coupon')
      .select('*')
      .eq('coupon_code', code)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching coupon',
      error: error.message
    });
  }
};

// Validate coupon
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.params;
    const { userId } = req.body;

    const { data: coupon, error } = await supabase
      .from('coupon')
      .select('*')
      .eq('coupon_code', code)
      .single();

    if (error) throw error;

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    // Check if coupon is already used
    if (coupon.is_used) {
      return res.status(400).json({
        success: false,
        message: 'Coupon has already been used'
      });
    }

    // Check if coupon is expired
    if (new Date(coupon.valid_until) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Coupon has expired'
      });
    }

    // Check if coupon is for specific user
    if (coupon.for_user && coupon.for_user !== userId) {
      return res.status(400).json({
        success: false,
        message: 'This coupon is not valid for this user'
      });
    }

    res.json({
      success: true,
      message: 'Coupon is valid',
      data: coupon
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating coupon',
      error: error.message
    });
  }
};

// Create new coupon
export const createCoupon = async (req, res) => {
  try {
    const couponData = req.body;

    // Validate coupon_value is a valid percentage (0-100) if provided
    if (couponData.coupon_value !== null && couponData.coupon_value !== undefined && couponData.coupon_value !== '') {
      const percentageValue = parseFloat(couponData.coupon_value);
      if (isNaN(percentageValue) || percentageValue < 0 || percentageValue > 100) {
        return res.status(400).json({
          success: false,
          message: 'Coupon value must be a percentage between 0 and 100'
        });
      }
    }

    // Check if coupon code already exists
    const { data: existing } = await supabase
      .from('coupon')
      .select('id')
      .eq('coupon_code', couponData.coupon_code)
      .single();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code already exists'
      });
    }

    const { data, error } = await supabase
      .from('coupon')
      .insert([couponData])
      .select();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('Error creating coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating coupon',
      error: error.message
    });
  }
};

// Update coupon
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate coupon_value is a valid percentage (0-100) if provided
    if (updates.coupon_value !== null && updates.coupon_value !== undefined && updates.coupon_value !== '') {
      const percentageValue = parseFloat(updates.coupon_value);
      if (isNaN(percentageValue) || percentageValue < 0 || percentageValue > 100) {
        return res.status(400).json({
          success: false,
          message: 'Coupon value must be a percentage between 0 and 100'
        });
      }
    }

    const { data, error } = await supabase
      .from('coupon')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.json({
      success: true,
      message: 'Coupon updated successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('Error updating coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating coupon',
      error: error.message
    });
  }
};

// Delete coupon
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('coupon')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting coupon',
      error: error.message
    });
  }
};

// Mark coupon as used
export const useCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // Get coupon first
    const { data: coupon, error: fetchError } = await supabase
      .from('coupon')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    if (coupon.is_used) {
      return res.status(400).json({
        success: false,
        message: 'Coupon has already been used'
      });
    }

    // Mark as used
    const { data, error } = await supabase
      .from('coupon')
      .update({ is_used: true })
      .eq('id', id)
      .select();

    if (error) throw error;

    // Record usage in coupon_usage table
    await supabase
      .from('coupon_usage')
      .insert([{
        coupon_id: id,
        user_id: userId
      }]);

    res.json({
      success: true,
      message: 'Coupon marked as used',
      data: data[0]
    });
  } catch (error) {
    console.error('Error using coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Error using coupon',
      error: error.message
    });
  }
};

// Get coupon statistics
export const getCouponStats = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('coupon')
      .select('is_used, valid_until');

    if (error) throw error;

    const now = new Date();
    const activeCoupons = data?.filter(
      c => !c.is_used && new Date(c.valid_until) > now
    ).length || 0;
    const usedCoupons = data?.filter(c => c.is_used).length || 0;
    const expiredCoupons = data?.filter(
      c => !c.is_used && new Date(c.valid_until) <= now
    ).length || 0;

    const stats = {
      totalCoupons: data?.length || 0,
      activeCoupons,
      usedCoupons,
      expiredCoupons
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching coupon stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching coupon statistics',
      error: error.message
    });
  }
};
