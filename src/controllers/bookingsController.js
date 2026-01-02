import { supabase } from '../config/supabase.js';

// Helper function to enrich bookings with doctor and patient data
async function enrichBookings(bookings) {
  if (!bookings || bookings.length === 0) {
    return [];
  }

  // Get unique doctor and patient IDs
  const doctorIds = [...new Set(bookings.map(b => b.doctor_id).filter(Boolean))];
  const patientIds = [...new Set(bookings.map(b => b.patient_id).filter(Boolean))];

  // Fetch doctors and patients in parallel
  const [doctorsRes, patientsRes] = await Promise.all([
    doctorIds.length > 0
      ? supabase.from('doctors').select('doctor_id, full_name, email, specialization, profile_img_url').in('doctor_id', doctorIds)
      : { data: [] },
    patientIds.length > 0
      ? supabase.from('patients').select('id, name, email, phone, profile_img_url').in('id', patientIds)
      : { data: [] }
  ]);

  // Create lookup maps
  const doctorsMap = new Map((doctorsRes.data || []).map(d => [d.doctor_id, d]));
  const patientsMap = new Map((patientsRes.data || []).map(p => [p.id, p]));

  // Enrich bookings with doctor and patient data
  return bookings.map(booking => ({
    ...booking,
    doctor: doctorsMap.get(booking.doctor_id) || null,
    patient: patientsMap.get(booking.patient_id) || null
  }));
}

// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    console.log("Bookings:", bookings); 

    if (error) throw error;

    const enrichedBookings = await enrichBookings(bookings || []);

    res.json({
      success: true,
      data: enrichedBookings,
      count: enrichedBookings.length
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const enrichedBookings = await enrichBookings([data]);

    res.json({
      success: true,
      data: enrichedBookings[0]
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};

// Get bookings by doctor ID
export const getBookingsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('booking_date', { ascending: false });

    if (error) throw error;

    const enrichedBookings = await enrichBookings(bookings || []);

    res.json({
      success: true,
      data: enrichedBookings,
      count: enrichedBookings.length
    });
  } catch (error) {
    console.error('Error fetching doctor bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor bookings',
      error: error.message
    });
  }
};

// Get bookings by patient ID
export const getBookingsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('patient_id', patientId)
      .order('booking_date', { ascending: false });

    if (error) throw error;

    const enrichedBookings = await enrichBookings(bookings || []);

    res.json({
      success: true,
      data: enrichedBookings,
      count: enrichedBookings.length
    });
  } catch (error) {
    console.error('Error fetching patient bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patient bookings',
      error: error.message
    });
  }
};

// Create new booking
export const createBooking = async (req, res) => {
  try {
    const bookingData = req.body;

    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

// Update booking
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking',
      error: error.message
    });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: pending, confirmed, cancelled, or completed'
      });
    }

    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking status',
      error: error.message
    });
  }
};

// Delete booking
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting booking',
      error: error.message
    });
  }
};

// Get booking statistics
export const getBookingStats = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('status, booking_date, total_amount');

    if (error) throw error;

    const now = new Date();
    const today = now.toISOString().split('T')[0];

    const stats = {
      totalBookings: data?.length || 0,
      pendingBookings: data?.filter(b => b.status === 'pending').length || 0,
      confirmedBookings: data?.filter(b => b.status === 'confirmed').length || 0,
      cancelledBookings: data?.filter(b => b.status === 'cancelled').length || 0,
      completedBookings: data?.filter(b => b.status === 'completed').length || 0,
      todayBookings: data?.filter(b => b.booking_date === today).length || 0,
      totalRevenue: data?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking statistics',
      error: error.message
    });
  }
};
