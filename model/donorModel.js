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
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

exports.donorModel = mongoose.model("donors", donorSchema)

