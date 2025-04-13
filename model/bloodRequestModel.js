const mongoose = require('mongoose'); 

const bloodRequestSchema = new mongoose.Schema({
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'hospital',
    required: true,
  },
  bloodGroup: {
    type: String,
    required: true,
  },
  numberOfPints: {
    type: Number,
    required: true,
  },
  preferredDate: {
    type: Date,
    required: true,
  },
  urgencyLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'fulfilled', 'cancelled'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
