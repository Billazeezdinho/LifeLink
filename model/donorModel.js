const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema(
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
      unique: true
    },
    password: {
      type: String,
      required: true,
    },
    bloodType: {
      type: String
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum:['pending', 'accepted', 'declined'],
      default: 'pending'
    },
    createdAt:{ 
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

exports.donorModel = mongoose.model("Donors", donorSchema)
