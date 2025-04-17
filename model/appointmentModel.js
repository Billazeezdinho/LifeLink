const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor', // Assuming you have a Donor model
    required: true,
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital', // Assuming you have a Hospital model
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rescheduled', 'cancelled'],
    default: 'pending',
  }
}, { timestamps: true });
exports.appointmentModel = mongoose.model('appointment', appointmentSchema);