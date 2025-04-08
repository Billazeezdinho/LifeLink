const mongoose = require('mongoose');


const hospitalSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  location: { type: String, required: true },
  role: { type: String, default: 'hospital' },
  password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('hospital', hospitalSchema);