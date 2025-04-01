const Donor = require('../model/donor');
const Appointment = require('../apointment');
const sendEmail = require('../utils/sendEmail');

exports.viewHospitals = async (req, res) => {
  try {
    // Fetch hospitals list
    const hospitals = await Hospital.find();
    res.status(200).json(hospitals);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.bookAppointment = async (req, res) => {
  const { hospitalId, date, time } = req.body;
  
  try {
    const appointment = new Appointment({
      donor: req.user.id,
      hospital: hospitalId,
      date,
      time,
    });
    await appointment.save();
    
    // Send email notification to the hospital
    sendEmail(
      'hospital-email@example.com',
      'Appointment Request',
      `A donor wants to book an appointment with you. Please log into the Lifelink app to read, add, confirm, or reschedule.`
    );

    res.status(200).json({ message: 'Appointment booked successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error booking appointment' });
  }
};
