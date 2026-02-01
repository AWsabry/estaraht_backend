import { supabase } from '../config/supabase.js';
import { deleteFirebaseUser } from '../config/firebase.js';

// Get all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data,
      count: data?.length || 0
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctors',
      error: error.message
    });
  }
};

// Get doctor by ID
export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('doctor_id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor',
      error: error.message
    });
  }
};

// Create new doctor
export const createDoctor = async (req, res) => {
  try {
    const doctorData = req.body;

    const { data, error } = await supabase
      .from('doctors')
      .insert([doctorData])
      .select();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating doctor',
      error: error.message
    });
  }
};

// Update doctor
export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('doctors')
      .update(updates)
      .eq('doctor_id', id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      message: 'Doctor updated successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating doctor',
      error: error.message
    });
  }
};

// Delete doctor
export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    // First, get the doctor to check if they exist
    const { data: doctor, error: fetchError } = await supabase
      .from('doctors')
      .select('doctor_id')
      .eq('doctor_id', id)
      .single();

    if (fetchError || !doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Cascade: delete related withdraws first (foreign key)
    const { error: withdrawsError } = await supabase
      .from('withdraws')
      .delete()
      .eq('doctor_id', id);

    if (withdrawsError) throw withdrawsError;

    // Delete from Supabase database
    const { error: deleteError } = await supabase
      .from('doctors')
      .delete()
      .eq('doctor_id', id);

    if (deleteError) throw deleteError;

    // Delete from Firebase Auth (using doctor_id as UID)
    const firebaseResult = await deleteFirebaseUser(id);
    
    res.json({
      success: true,
      message: 'Doctor deleted successfully',
      firebaseDeleted: firebaseResult.success,
      firebaseMessage: firebaseResult.message
    });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting doctor',
      error: error.message
    });
  }
};

// Get doctor statistics
export const getDoctorStats = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('avg_rating, numb_session, numb_patients');

    if (error) throw error;

    const stats = {
      totalDoctors: data?.length || 0,
      averageRating: data?.reduce((acc, d) => acc + (d.avg_rating || 0), 0) / (data?.length || 1),
      totalSessions: data?.reduce((acc, d) => acc + (d.numb_session || 0), 0),
      totalPatients: data?.reduce((acc, d) => acc + (d.numb_patients || 0), 0)
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching doctor stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor statistics',
      error: error.message
    });
  }
};
