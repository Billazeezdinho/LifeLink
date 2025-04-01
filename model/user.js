const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true, 
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      lowerCase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

exports.userModel = mongoose.model("user", userSchema)


// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: {
//     type: String,
//     enum: ['ADMIN', 'DONOR', 'HOSPITAL'],
//     required: true,
//   },
//   isKYCVerified: { type: Boolean, default: false }, 
// });

// module.exports = mongoose.model('User', userSchema);

