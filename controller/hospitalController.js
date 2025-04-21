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
const welcomeMail = require("../utils/hospitalWelcome");
const email  = require("../utils/email");
require("dotenv").config(); 
const BloodRequest = require('../model/bloodRequestModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' }); 
const cloudinary = require('../config/cloudinary');
const moment = require('moment');
const bloodRequestModel = require("../model/bloodRequestModel");


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
    const donorExists = await donorModel.findOne({ email: email.toLowerCase()});
    if(donorExists){
      return res.status(400).json({
        message:  `Email ${email} is already a registered Donor`
      })
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

      const token = await jwt.sign({ hospitalId: hospital._id }, process.env.key, { expiresIn: "10mins" });
        const link = `lifelink-xi.vercel.app/verifymail/${token}`
        // `${req.protocol}://${req.get("host")}/api/v1/verify-user/${token}`;
        const hospitalName = hospital.fullName.split(" ")[0];
        const mailDetails = {
        email: hospital.email,
        subject: "Welcome to LIFELINK",
        html: welcomeMail(hospitalName, link),
      };
    await hospital.save();
    await sendMail(mailDetails)

    res.status(201).json({
      message: "Hospital created successfully",
      data: hospital,
      token
    });
  } catch (error) {
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
    res.status(500).json({
      message: 'Internal Server Error ' + error.message
    });
  }
};


  exports.searchForDonors = async (req, res) => {
    try {
      
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
 

// exports.submitBloodRequest = async (req, res) => { 
//   try {
//     let { bloodGroup, numberOfPints, preferredDate, urgencyLevel, amount } = req.body;

//     if (req.user.role !== 'hospital') {
//       return res.status(403).json({ message: 'Only hospitals can make a blood request' });
//     }

//     if (typeof amount === 'string') {
//       amount = parseFloat(amount.replace(/,/g, ''));
//     }

//     if (!numberOfPints) {
//       return res.status(400).json({ message: "numberOfPints is required." });
//     }

//     const formattedPreferredDate = moment(preferredDate, 'YYYY-MM-DD');

//     // Create the blood request
//     const request = new BloodRequest({
//       hospital: req.user._id,
//       bloodGroup,
//       numberOfPints,
//       preferredDate: formattedPreferredDate,
//       urgencyLevel,
//       amount,
//     });

//     await request.save();

//     // 🔥 New part: notify all donors
//     const donors = await donorModel.find({});
//     const donorEmails = [];

//     if (donors.length > 0) {
//       const updatePromises = donors.map(async (donor) => {
//         // Check if donor is missing required fields and skip if invalid
//         if (!donor.fullName || !donor.email || !donor.location || !donor.age || !donor.gender) {
//           console.log(`Skipping donor with missing fields: ${donor._id}`);
//           return; // Skip updating this donor if any required fields are missing
//         }

//         // Add notification to donor
//         donor.notifications.push({
//           message: `New blood request for ${bloodGroup} blood group. Check the blood requests page.`,
//           from: 'LifeLink',
//           date: new Date()
//         });

//         await donor.save(); // Save the donor with the new notification
//         donorEmails.push(donor.email); // Collect donor emails for notifications
//       });

//       await Promise.all(updatePromises);
//     }

//     // Send emails to all donors if email addresses are collected
//     if (donorEmails.length > 0) {
//       const emailPromises = donorEmails.map(email => 
//         sendEmail({
//           to: email,
//           subject: 'Urgent Blood Donation Request',
//           html: `
//             <h2>Urgent Blood Request</h2>
//             <p>A new blood donation request has been posted for blood group <strong>${bloodGroup}</strong>.</p>
//             <p>Please log in to LifeLink to check the details and schedule a donation if you can help.</p>
//           `
//         })
//       );

//       await Promise.all(emailPromises);
//     }

//     const responseData = {
//       _id: request._id,
//       hospital: request.hospital,
//       bloodGroup: request.bloodGroup,
//       numberOfPints: request.numberOfPints,
//       preferredDate: moment(request.preferredDate).format('YYYY-MM-DD'), 
//       urgencyLevel: request.urgencyLevel,
//       amount: request.amount,
//       status: request.status,
//       createdAt: moment(request.createdAt).format('YYYY-MM-DD HH:mm'),
//       updatedAt: moment(request.updatedAt).format('YYYY-MM-DD HH:mm'),
//     };

//     res.status(201).json({ message: 'Blood request submitted successfully', data: responseData });

//   } catch (error) {
//     console.error('Error submitting blood request:', error.message);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };
exports.submitBloodRequest = async (req, res) => { 
  try {
    let { bloodGroup, numberOfPints, preferredDate, urgencyLevel, amount } = req.body;

    if (req.user.role !== 'hospital') {
      return res.status(403).json({ message: 'Only hospitals can make a blood request' });
    }

    if (typeof amount === 'string') {
      amount = parseFloat(amount.replace(/,/g, ''));
    }

    if (!numberOfPints) {
      return res.status(400).json({ message: "numberOfPints is required." });
    }

    const formattedPreferredDate = moment(preferredDate, 'YYYY-MM-DD');

    // Create the blood request
    const request = new BloodRequest({
      hospital: req.user._id,
      bloodGroup,
      numberOfPints,
      preferredDate: formattedPreferredDate,
      urgencyLevel,
      amount,
    });

    await request.save();

    // 🔥 Instead of loading and saving each donor, just push a notification to all at once
    await donorModel.updateMany(
      {},
      {
        $push: {
          notifications: {
            message: `New blood request for ${bloodGroup} blood group. Check the blood requests page.`,
            from: 'LifeLink',
            date: new Date()
          }
        }
      }
    );

    // Fetch emails only
    const donors = await donorModel.find({}, 'email');
    const donorEmails = donors.map(donor => donor.email).filter(email => !!email);

    if (donorEmails.length > 0) {
      const emailPromises = donorEmails.map(email => 
        sendEmail({
          email,
          subject: 'Urgent Blood Donation Request',
          html: `
            <h2>Urgent Blood Request</h2>
            <p>A new blood donation request has been posted for blood group <strong>${bloodGroup}</strong>.</p>
            <p>Please log in to LifeLink to check the details and schedule a donation if you can help.</p>
          `
        })
      );

      await Promise.all(emailPromises);
    }

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
    console.error('Error submitting blood request:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


  exports.getAppointmentHistory = async (req, res) => {
    try {
      // Ensure the user is a hospital
      if (req.user.role !== 'hospital') {
        return res.status(403).json({ message: 'Only hospitals can view their appointment history' });
      }
  
      // Fetch the hospital's appointment history
      const appointments = await appointmentModel.find({ hospital: req.user.id })
        .sort({ date: -1 })  // Sort by date, most recent first
        .populate('donor', 'fullName email bloodType')  // Populate donor details
        .select('donor hospital date time status createdAt updatedAt'); // Explicitly select fields
  
      if (appointments.length === 0) {
        return res.status(404).json({ message: 'No appointments found for this hospital.' });
      }
  
      res.status(200).json({ appointments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error, please try again later.' });
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
        .select('bloodGroup numberOfPints preferredDate urgencyLevel amount status createdAt updatedAt'); 
  
      if (requests.length === 0) {
        return res.status(404).json({ message: 'No blood requests found for this hospital.' });
      }
  
      res.status(200).json({ requests });
    } catch (error) {
      res.status(500).json({ message: 'Server error, please try again later.' });
    }
  };

exports.getHospitalProfile = async (req, res) => {
  try {
    

    const hospital = await hospitalModel.findById(req.user.id).select('-password');

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.status(200).json({ hospital });
  } catch (error) {
    
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};

exports.getOneHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const hospital = await hospitalModel.findById(hospitalId).select('-password'); 

    if (!hospital) {
      return res.status(404).json({ 
        message: 'Hospital not found.' 
      });
    }

    res.status(200).json({
      message: 'Hospital fetched successfully',
      hospital,
    });
  } catch (error) {
    
    res.status(500).json({
       message: 'Server error' + error.message 

    });
  }
};

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

    const token = jwt.sign({ id: hospital._id }, process.env.key, { expiresIn: '1h' });

    const resetLink = `https://lifelink-xi.vercel.app/resetpassword/${token}`;

    // HTML email content
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Password Reset</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f6f9fc;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: auto;
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
            padding: 30px;
            text-align: center;
          }
          .button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 25px;
            font-size: 16px;
            color: #ffffff;
            background: linear-gradient(90deg, #0077b6, #e63946);
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
          }
          .button:hover {
            background: linear-gradient(90deg, #005f87, #c5303f);
          }
          .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #999;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Password Reset Request</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password for your LifeLink account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetLink}" class="button">Reset Password</a>
          <p>If you did not request this, please ignore this email.</p>
          <div class="footer">
            &copy; ${new Date().getFullYear()} LifeLink. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;

    // Send the reset email with HTML
    await sendEmail(
      email,
      'Password Reset Request',
      htmlContent
    );

    res.status(200).json({
      message: 'Password reset link sent to your email',
      token: token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error sending password reset email', error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params; // 🔥 Get token from URL params
  const { newPassword } = req.body; // 🔥 Get new password from request body

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.KEY);
    const hospitalId = decoded.id;

    // Find hospital by ID
    const hospital = await hospitalModel.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    hospital.password = hashedPassword;
    await hospital.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Token has expired. Please request a new password reset link.' });
    }
    res.status(500).json({ message: 'Error resetting password: ' + error.message });
  }
};


exports.submitKYC = async (req, res) => {
  try {
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
    res.status(500).json({ message: 'KYC submission failed', error: error.message });
  }
};

exports.getHospitalAppointments = async (req, res) => {
  try {
    if (req.user.role !== "hospital") {
      return res.status(403).json({ message: "Only hospitals can view their appointments." });
    }

    const appointments = await appointmentModel
      .find({ hospital: req.user._id })
      .populate("donor", "fullName email bloodType phoneNumber")
      .sort({ createdAt: -1 }); // Latest first

    res.status(200).json({
      message: 'Appointment fetched successfully',
      data: appointments });
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching appointments. " + error.message });
  }
};


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
    res.status(500).json({ message: "Server error while responding to appointment." + error.message });
  }
};

exports.getAllHospitalBloodRequests = async (req, res) => {
  try {
   
    const donor = await donorModel.findById(req.user._id).select('fullName email bloodGroup address');

    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    const bloodRequests = await bloodRequestModel.find({ })
      .populate({
        path: 'hospital',
        select: 'fullName address phoneNumber city profilePicture'
      })
      .sort({ createdAt: -1 }); 
      
    if (!bloodRequests.length) {
      return res.status(404).json({ message: "No active blood requests found" });
    }

    res.status(200).json({
      message: "Active blood requests fetched successfully",
      donor: {
        fullName: donor.fullName,
        email: donor.email,
        bloodGroup: donor.bloodGroup,
        address: donor.address
      },
      bloodRequests
    });

  } catch (error) {
    console.error("Error fetching blood requests:" + error.message);
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
};

exports.getOneBloodRequestById = async (req, res) => {
  try {
    const donor = req.user; 

    if (!donor) {
      return res.status(401).json({ message: "Unauthorized. Donor not found." });
    }

    const bloodRequestId = req.params.id;

    const bloodRequest = await bloodRequestModel.findById(bloodRequestId)
      .populate({
        path: 'hospital',
        select: 'fullName address phoneNumber city profilePics' 
      });

    if (!bloodRequest) {
      return res.status(404).json({ message: 'Blood request not found' });
    }

    res.status(200).json({
      message: 'Blood request fetched successfully',
      data: {
        _id: bloodRequest._id,
        hospital: bloodRequest.hospital,
        bloodGroup: bloodRequest.bloodGroup,
        numberOfPints: bloodRequest.numberOfPints,
        preferredDate: bloodRequest.preferredDate,
        urgencyLevel: bloodRequest.urgencyLevel,
        amount: bloodRequest.amount,
        status: bloodRequest.status,
        createdAt: bloodRequest.createdAt,
        updatedAt: bloodRequest.updatedAt,
      }
    });

  } catch (error) {
    console.error('Error fetching blood request by ID:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

