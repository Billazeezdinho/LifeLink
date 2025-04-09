const donorModel  = require("../models/donorModel"); 
const  hospitalModel  = require("../models/hospitalModel"); 
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken"); 
const { resetMail } = require("../utils/resetMail"); 
const { sendEmail } = require("../utils/sendEmail");
require("dotenv").config(); 
const Appointment = require("../models/appointmentModel");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' }); 
const cloudinary = require('../config/cloudinaryConfig');


exports.register =async (req, res) => {

  try {
    const { fullName, email, location, role, password } = req.body;

    console.log('Request body:', req.body);
    // Validate input
    if (!fullName || !email || !location || !role || !password) {
      return res.status(400).json({
        message: "All fields (fullName, email, location, role, password) are required",
      });
    }

    const emailNormalized = email.toLowerCase();
    const hospitalExists = await hospitalModel.findOne({ email: emailNormalized });

    if (hospitalExists) {
      return res.status(400).json({
        message: `Email ${email} is already registered`,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const hospital = new hospitalModel({
      fullName: fullName.trim(),
      email: emailNormalized,
      location: location.trim(),
      role: role.trim(),
      password: hashedPassword,
    });

    await hospital.save();

    res.status(201).json({
      message: "Hospital created successfully",
      data: hospital,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal server error " + error.message,
    });
  }
};

  exports.login = async (req, res)=>{
    try{
      const {email, password} = req.body;
      if(email == undefined || password == undefined){
        return res.status(400).json({
          message: 'Email and password required'
        })
      }
  
    const hospital = await hospitalModel.findOne({email: email.toLowerCase() });
    if(hospital == null){
      return res.status(404).json({
        message: 'Hospital Not Found'
      })
    }
    const isPasswordCorrect = await bcrypt.compare(password, hospital.password)
    if(isPasswordCorrect == false){
      return res.status(400).json({
        message: 'Incorrect Password'
      })
    }
    const token = jwt.sign({ id: hospital._id }, process.env.JWT_SECRET, {
          expiresIn: '1d'
        });
    res.status(200).json({
      message: 'Logged In Successfully',
      data: hospital,
      token
    })
    }catch(error){
      console.log(error.message)
      res.status(500).json({
        message: 'Internal Server Error '+ error.message
      })
    }
  }

exports.searchForDonors = async (req, res) => {
  try {
    if (req.user.role !== 'HOSPITAL') {
      return res.status(403).json({ message: 'Access denied. Only hospitals can search for donors.' });
    }
    if (!req.user.isKYCVerified) {
      return res.status(400).json({ message: 'You are yet to complete your KYC, check your email and complete it.' });
    }
    
    const donors = await donorModel.find(); // Assuming donor data exists
    res.status(200).json(donors);
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

exports.viewAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ hospital: req.user.id }).populate('donor', 'fullName email');
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching appointments' });
  }
}
exports.viewDonorProfile = async (req, res) => {
  try {
    const donor = await donorModel.findById(req.params.donorId);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.status(200).json(donor);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching donor profile' });
  }
};


// In hospitalController.js
exports.updateProfile = async (req, res) => {
  upload.single('profilePicture')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "Error uploading file", error: err.message });
    }

    const { phone, address, city, state } = req.body;
    const hospitalId = req.user.id;

    // Initialize an update object for the hospital
    const updatedHospitalData = {};

    // If there's a file, upload it to Cloudinary
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'hospital-profiles',  // You can change this to any folder name you like
          resource_type: 'auto',         // Automatically handles image, video, etc.
        });

        updatedHospitalData.profilePicture = result.secure_url;  // Get the URL of the uploaded image
      } catch (uploadError) {
        return res.status(500).json({ message: 'Error uploading file to Cloudinary', error: uploadError.message });
      }
    }

    // Add other fields to the update object if present
    if (phone) updatedHospitalData.phone = phone;
    if (address) updatedHospitalData.address = address;
    if (city) updatedHospitalData.city = city;
    if (state) updatedHospitalData.state = state;

    try {
      const updatedHospital = await hospitalModel.findByIdAndUpdate(
        hospitalId,
        { $set: updatedHospitalData },
        { new: true, runValidators: true }
      );

      if (!updatedHospital) {
        return res.status(404).json({ message: 'Hospital not found' });
      }

      res.status(200).json({
        message: 'Profile updated successfully',
        data: updatedHospital,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Error updating profile' });
    }
  });
};


exports.deleteAccount = async (req, res) => {
  const hospitalId = req.user.id; // Assuming the user ID is stored in req.user.id

  try {
    const deletedHospital = await hospitalModel.findByIdAndDelete(hospitalId);

    if (!deletedHospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.status(200).json({
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Error deleting account' });
  }
};



exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const hospital = await hospitalModel.findOne({ email: email.toLowerCase() });
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    // Generate the password reset token
    const token = jwt.sign({ id: hospital._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the reset email
    await sendEmail(email, 'Password Reset', `Click the link to reset your password: ${process.env.FRONTEND_URL}/reset-password/${token}`);

    // Respond with the token for testing purposes
    res.status(200).json({
      message: 'Password reset link sent to your email',
      token: token // Include the token in the response
    });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({ message: 'Error sending password reset email', error: error.message });
  }
};


exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  try {
    // Decode the token to get hospital ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hospitalId = decoded.id;

    // Find the hospital by ID
    const hospital = await hospitalModel.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the hospital's password
    hospital.password = hashedPassword;
    await hospital.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
};

