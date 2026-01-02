import { supabase } from '../config/supabase.js';

// Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    console.log(data);
    if (error) throw error;

    res.json({
      success: true,
      data,
      count: data?.length || 0
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// Get review by ID
export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching review',
      error: error.message
    });
  }
};

// Get reviews by booking ID
export const getReviewsByBookingId = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data,
      count: data?.length || 0
    });
  } catch (error) {
    console.error('Error fetching reviews by booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews by booking',
      error: error.message
    });
  }
};

// Get reviews by doctor ID
export const getReviewsByDoctorId = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data,
      count: data?.length || 0
    });
  } catch (error) {
    console.error('Error fetching reviews by doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews by doctor',
      error: error.message
    });
  }
};

// Get reviews by patient ID
export const getReviewsByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data,
      count: data?.length || 0
    });
  } catch (error) {
    console.error('Error fetching reviews by patient:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews by patient',
      error: error.message
    });
  }
};

// Create new review
export const createReview = async (req, res) => {
  try {
    const reviewData = req.body;

    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: error.message
    });
  }
};

// Update review
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review',
      error: error.message
    });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    });
  }
};

// Get review statistics
export const getReviewStats = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating');

    if (error) throw error;

    const ratings = data?.map(r => parseInt(r.rating)) || [];
    const stats = {
      totalReviews: ratings.length,
      averageRating: ratings.length > 0 
        ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(2)
        : 0,
      ratingDistribution: {
        '5': ratings.filter(r => r === 5).length,
        '4': ratings.filter(r => r === 4).length,
        '3': ratings.filter(r => r === 3).length,
        '2': ratings.filter(r => r === 2).length,
        '1': ratings.filter(r => r === 1).length
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching review stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching review statistics',
      error: error.message
    });
  }
};

