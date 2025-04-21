const mongoose = require('mongoose');

const donationRecordSchema = new mongoose.Schema({
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  donorName: { type: String, required: true },
  bloodType: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['SUCCESSFUL', 'PENDING', 'CANCELLED'], default: 'PENDING' }
}, { timestamps: true });

module.exports = mongoose.model('DonationRecord', donationRecordSchema);
