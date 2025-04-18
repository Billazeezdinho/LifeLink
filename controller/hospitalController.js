const {donorModel}  = require("../model/donorModel"); 
const  hospitalModel  = require("../model/hospitalModel");
const Hospital = require("../model/hospitalModel"); 
const {appointmentModel} = require("../model/appointmentModel"); 
const KYC = require('../model/kycModel');
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken"); 
const { resetMail } = require("../utils/resetMail"); 
const { sendEmail } = require("../utils/sendEmail");
const sendMail = require("../utils/email");
const email  = require("../utils/email");
require("dotenv").config(); 
const BloodRequest = require('../model/bloodRequestModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' }); 
const cloudinary = require('../config/cloudinary');
const moment = require('moment')


exports.register =async (req, res) => {

  try {
    const { fullName, email, location, role, password, phone, city } = req.body;    
    // Validate input
    if (!fullName || !email || !location || !role || !password || !phone || !city) {
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
      role: role.trim().toLowerCase(),
      password: hashedPassword,
      phone: phone.trim().toLowerCase(),
      city: city.trim().toLowerCase(),
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

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const hospital = await hospitalModel.findOne({ email: email.toLowerCase() });
    if (!hospital) {
      return res.status(404).json({ message: 'invalid credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, hospital.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    //  Ensure role is saved correctly
    if (hospital.role.toLowerCase() !== 'hospital') {
      await hospitalModel.updateOne(
        { email: hospital.email },
        { $set: { role: 'hospital' } }
      );
      hospital.role = 'hospital'; // Also update the local object
    }

    console.log('Hospital Role:', hospital.role);

    const token = jwt.sign(
      { id: hospital._id, role: hospital.role }, // Now guaranteed to be lowercase
      process.env.key,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Logged In Successfully',
      data: hospital,
      token
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Internal Server Error ' + error.message
    });
  }
};


  exports.searchForDonors = async (req, res) => {
    try {
      console.log(req.user);  // Debugging line to see the user data
  
      if (req.user.role !== 'hospital') {
        return res.status(403).json({ message: 'Access denied. Only hospitals can search for donors.' });
      }
  
      if (!req.user.isKycVerified) {
        return res.status(400).json({ message: 'You are yet to complete your KYC, check your email and complete it.' });
      }
  
      const donors = await donorModel.find();
      res.status(200).json(donors);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  
  exports.submitBloodRequest = async (req, res) => { 
    try {
      let { bloodGroup, numberOfPints, preferredDate, urgencyLevel, amount } = req.body;
  
      if (req.user.role !== 'hospital') {
        return res.status(403).json({ message: 'Only hospitals can make a blood request' });
      }
      if (typeof amount === 'string') {
        amount = parseFloat(amount.replace(/,/g, ''));
      }
  
      // Validate numberOfPints is provided and is a number
      if (!numberOfPints) {
        return res.status(400).json({ message: "numberOfPints is required." });
      }

      const formattedPreferredDate = moment(preferredDate, 'YYYY-MM-DD');
      const request = new BloodRequest({
        hospital: req.user.id,  // Referring to the hospital
        bloodGroup,
        numberOfPints,
        preferredDate: formattedPreferredDate ,
        urgencyLevel,
        amount,  // Correct field to match schema
      });
  
      await request.save();

      const responseData = {
        _id: request._id,
        hospital: request.hospital,
        bloodGroup: request.bloodGroup,
        numberOfPints: request.numberOfPints,
        preferredDate: moment(request.preferredDate).format('YYYY-MM-DD'), 
        urgencyLevel: request.urgencyLevel,
        amount: request.amount,
        status: request.status,
        createdAt: moment(request.createdAt).format('YYYY-MM-DD HH:mm'),
        updatedAt: moment(request.updatedAt).format('YYYY-MM-DD HH:mm'),
      };
  
      res.status(201).json({ message: 'Blood request submitted successfully', data: responseData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  exports.getBloodRequestHistory = async (req, res) => {
    try {
      // Ensure the user is a hospital
      if (req.user.role !== 'hospital') {
        return res.status(403).json({ message: 'Only hospitals can view their blood request history' });
      }
  
      // Fetch the hospital's blood request history
      const requests = await BloodRequest.find({ hospital: req.user.id })
        .sort({ createdAt: -1 })
          // Sort by date, most recent first
        .select('bloodGroup numberOfPints preferredDate urgencyLevel amount status createdAt updatedAt'); // Explicitly select fields
  
      console.log('Fetched requests:', requests);
      if (requests.length === 0) {
        return res.status(404).json({ message: 'No blood requests found for this hospital.' });
      }
  
      res.status(200).json({ requests });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error, please try again later.' });
    }
  };

exports.getHospitalProfile = async (req, res) => {
  try {
    console.log("hospital Role:", req.user.role);
    console.log("req.user:", req.user);

    const hospital = await hospitalModel.findById(req.user.id).select('-password');

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.status(200).json({ hospital });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again later.' });
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
    const token = jwt.sign({ id: hospital._id }, process.env.key, { expiresIn: '1h' });

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
    const decoded = jwt.verify(token, process.env.key);
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

exports.submitKYC = async (req, res) => {
  try {
    console.log('--- Incoming KYC Request ---');
    const { hospitalId } = req.user; // Hospital ID from the user object
    const { licenseNumber } = req.body;
    const files = req.files;

    // Check if there is an existing KYC document for the hospital
    const existingKYC = await KYC.findOne({ hospital: hospitalId });

    // If a previous KYC exists, check its status
    if (existingKYC) {
      if (existingKYC.status === 'pending') {
        return res.status(400).json({
          message: 'A KYC is already pending for this hospital. Resubmission is not allowed.',
        });
      }

      if (existingKYC.status === 'declined') {
        console.log('Previous KYC was declined. Deleting and allowing resubmission.');
        await KYC.findByIdAndDelete(existingKYC._id); // Delete the old declined KYC document
      }
    }

    // Upload files to Cloudinary
    const facilityImageUpload = await cloudinary.uploader.upload(files.facilityImage[0].path);
    const certificateUpload = await cloudinary.uploader.upload(files.accreditedCertificate[0].path);
    const utilityBillUpload = await cloudinary.uploader.upload(files.utilityBill[0].path);

    // Save the new KYC data
    const kycData = await KYC.create({
      hospital: hospitalId,
      facilityImage: facilityImageUpload.secure_url,
      accreditedCertificate: certificateUpload.secure_url,
      licenseNumber,
      utilityBill: utilityBillUpload.secure_url,
      status: 'pending', // Set status to 'pending' for new submissions
    });

    // Mark hospital as KYC complete (optional, depends on your logic)
    await Hospital.findByIdAndUpdate(hospitalId, { kycCompleted: true });

    res.status(201).json({ message: 'KYC submitted successfully', kycData });
  } catch (error) {
    console.error('KYC Error:', error);
    res.status(500).json({ message: 'KYC submission failed', error: error.message });
  }
};

exports.getHospitalAppointments = async (req, res) => {
  try {
    if (req.user.role !== "hospital") {
      return res.status(403).json({ message: "Only hospitals can view their appointments." });
    }

    const appointments = await appointmentModel
      .find({ hospital: req.user.id })
      .populate("donor", "fullName email bloodType phoneNumber")
      .sort({ createdAt: -1 }); // Latest first

    res.status(200).json({ appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching appointments. " + error.message });
  }
};

// Accept or Reject an appointment
exports.respondToAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body; // expected 'accepted' or 'declined'

    if (!["accepted", "declined"].includes(status)) {
      return res.status(400).json({ message: "Status must be either 'accepted' or 'declined'." });
    }

    const appointment = await appointmentModel.findById(appointmentId).populate("donor", "fullName email");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    if (appointment.hospital.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only manage your own hospital appointments." });
    }

    appointment.status = status;
    await appointment.save();

    await sendMail(
      appointment.donor.email,
      `Appointment ${status === "accepted" ? "Accepted" : "Declined"}`,
      `Hello ${appointment.donor.fullName},

Your appointment request has been ${status} by the hospital.

Please log in to your LifeLink dashboard to view more details.

Thank you,
LifeLink Team`
    );

    await donorModel.findByIdAndUpdate(appointment.donor._id, {
      $push: {
        notifications: {
          message: `Your appointment was ${status} by the hospital.`,
          from: "Hospital",
        },
      },
    });

    res.status(200).json({ message: `Appointment ${status} successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while responding to appointment." + error.message });
  }
};
