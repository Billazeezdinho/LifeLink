const donorModel  = require("../model/donorModel"); 
const  hospitalModel  = require("../model/hospitalModel"); 
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken"); 
const { sendEmail } = require("../utils/resetMail"); 
require("dotenv").config(); 

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