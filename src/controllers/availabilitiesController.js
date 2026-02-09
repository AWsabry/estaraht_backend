import { supabase } from '../config/supabase.js';

// Get all availabilities (optional, for admin list)
export const getAllAvailabilities = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('availabilities')
      .select('*')
      .order('doctor_id')
      .order('day_number', { ascending: true });

    if (error) throw error;

    res.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    console.error('Error fetching availabilities:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching availabilities',
      error: error.message,
    });
  }
};

// Get availabilities by doctor ID
export const getAvailabilitiesByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const { data, error } = await supabase
      .from('availabilities')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('day_number', { ascending: true });

    if (error) throw error;

    res.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    console.error('Error fetching doctor availabilities:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching availabilities',
      error: error.message,
    });
  }
};

// Get availability by ID
export const getAvailabilityById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('availabilities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Availability not found',
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching availability',
      error: error.message,
    });
  }
};

// Create availability
export const createAvailability = async (req, res) => {
  try {
    const row = req.body;

    const { data, error } = await supabase
      .from('availabilities')
      .insert([row])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Availability created successfully',
      data,
    });
  } catch (error) {
    console.error('Error creating availability:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating availability',
      error: error.message,
    });
  }
};

// Update availability
export const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('availabilities')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Availability not found',
      });
    }

    res.json({
      success: true,
      message: 'Availability updated successfully',
      data,
    });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating availability',
      error: error.message,
    });
  }
};

// Delete availability
export const deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from('availabilities').delete().eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Availability deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting availability:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting availability',
      error: error.message,
    });
  }
};
