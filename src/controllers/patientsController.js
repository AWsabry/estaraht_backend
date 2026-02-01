import { supabase } from '../config/supabase.js';
import { deleteFirebaseUser } from '../config/firebase.js';

// Get all patients
export const getAllPatients = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data,
      count: data?.length || 0
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patients',
      error: error.message
    });
  }
};

// Get patient by ID
export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patient',
      error: error.message
    });
  }
};

// Create new patient
export const createPatient = async (req, res) => {
  try {
    const patientData = req.body;

    const { data, error } = await supabase
      .from('patients')
      .insert([patientData])
      .select();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating patient',
      error: error.message
    });
  }
};

// Update patient
export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      message: 'Patient updated successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating patient',
      error: error.message
    });
  }
};

// Delete patient
export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    // First, get the patient to check if they exist
    const { data: patient, error: fetchError } = await supabase
      .from('patients')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError || !patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Delete from Supabase database
    const { error: deleteError } = await supabase
      .from('patients')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    // Delete from Firebase Auth (using patient id as UID)
    const firebaseResult = await deleteFirebaseUser(id);
    
    res.json({
      success: true,
      message: 'Patient deleted successfully',
      firebaseDeleted: firebaseResult.success,
      firebaseMessage: firebaseResult.message
    });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting patient',
      error: error.message
    });
  }
};

// Get patient statistics
export const getPatientStats = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('gender');

    if (error) throw error;

    const stats = {
      totalPatients: data?.length || 0,
      maleCount: data?.filter(p => p.gender?.toLowerCase() === 'male').length || 0,
      femaleCount: data?.filter(p => p.gender?.toLowerCase() === 'female').length || 0
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching patient stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patient statistics',
      error: error.message
    });
  }
};
