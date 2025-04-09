const { string } = require("joi");
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
    age: {
      type: String,
      required: true,
    
    },
    gender: {
      type: String,
      required: true,
    },
    profilePics: {
      type: String
    },
    status: {
      type: String,
      enum:['pending', 'accepted', 'declined'],
      default: 'pending'
    },
    donations:[{
      hospitalId: mongoose.Schema.Types.ObjectId,
      date: Date,
      status:{
        type: string,
        enum: ['pending', 'accepted', 'declined'],
      default: 'pending'
      },
    },
  ],
    notifications:[{
      message:{
        type: String,
        required: true
       },
      from:{
        type: String
      },
      date:{
        type: Date, default: Date.now
      }
    }],
    createdAt:{ 
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

exports.donorModel = mongoose.model("Donors", donorSchema)
