const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// Book appointment
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;
    if (!doctorId || !date || !time) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    if (!doctor.available) return res.status(400).json({ success: false, message: 'Doctor is not available' });

    // Check slot conflict
    const conflict = await Appointment.findOne({ doctorId, date, time, status: { $in: ['pending','confirmed'] } });
    if (conflict) return res.status(400).json({ success: false, message: 'This slot is already booked' });

    const appointment = await Appointment.create({ userId: req.user._id, doctorId, date, time, amount: doctor.fees });
    res.status(201).json({ success: true, appointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get user appointments
const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id })
      .populate('doctorId', 'name email speciality fees image experience')
      .sort({ createdAt: -1 });
    const formatted = appointments.map(apt => ({
      _id:      apt._id,
      date:     apt.date,
      time:     apt.time,
      status:   apt.status,
      doctorId: apt.doctorId?._id,
      doctor:   apt.doctorId,
    }));
    res.json({ success: true, appointments: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Cancel appointment (user)
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, userId: req.user._id });
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    if (appointment.status === 'completed') return res.status(400).json({ success: false, message: 'Cannot cancel completed appointment' });
    appointment.status = 'cancelled';
    await appointment.save();
    res.json({ success: true, message: 'Appointment cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update appointment status (doctor)
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findOne({ _id: req.params.id, doctorId: req.doctor._id });
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    appointment.status = status;
    await appointment.save();
    res.json({ success: true, message: `Appointment ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { bookAppointment, getUserAppointments, cancelAppointment, updateAppointmentStatus };