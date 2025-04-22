const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
  },
  facilityImage: String,
  accreditedCertificate: String,
  licenseNumber: String,
  utilityBill: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'declined'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('KYC', kycSchema);
