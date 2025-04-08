const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const hospitalModel = require("../model/hospitalModel");
const donorModel = require("../model/donorModel");
const adminModel  = require("../model/adminModel"); 
require("dotenv").config();
require("../utils/resetMail");


exports.adminRegister = async (req, res) => {

  try {
    const { fullName, email, role, password } = req.body;

    console.log('Request body:', req.body);
    // Validate input
    if (!fullName || !email || !role || !password) {
      return res.status(400).json({
        message: "All fields (fullName, email, role, password) are required",
      });
    }

    const emailNormalized = email.toLowerCase();
    const userExists = await adminModel.findOne({ email: emailNormalized });

    if (userExists) {
      return res.status(400).json({
        message: `Email ${email} is already registered`,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new adminModel({
      fullName: fullName.trim(),
      email: emailNormalized,
      role,
      password: hashedPassword,
    });

    await admin.save();

    res.status(201).json({
      message: "Admin created successfully",
      data: admin,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal server error " + error.message,
    });
  }
};

  exports.adminLogin = async (req, res)=>{
    try{
      const {email, password} = req.body;
      if(email == undefined || password == undefined){
        return res.status(400).json({
          message: 'Email and password required'
        })
      }
  
    const admin = await adminModel.findOne({email: email.toLowerCase() });
    if(admin == null){
      return res.status(404).json({
        message: 'Donor Not Found'
      })
    }
    const isPasswordCorrect = await bcrypt.compare(password, admin.password)
    if(isPasswordCorrect == false){
      return res.status(400).json({
        message: 'Incorrect Password'
      })
    }
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });
    
    res.status(200).json({
      message: 'Logged In Successfully',
      data: admin,
      token
    })
    }catch(error){
      console.log(error.message)
      res.status(500).json({
        message: 'Internal Server Error '+ error.message
      })
    }
  }

// In adminController.js

exports.viewUsers = async (req, res) => {
  try {
    // Fetch all donors
    const donors = await donorModel.find();

    // Fetch all hospitals
    const hospitals = await hospitalModel.find();

    // Combine both donor and hospital data
    const users = {
      donors,
      hospitals
    };

    return res.status(200).json({
      message: "Users retrieved successfully",
      data: users
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Error retrieving users" });
  }
};


exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Try deleting from donor
let user = await donorModel.findByIdAndDelete(userId);
if (!user) {
  // If not found in donor, try hospital
  user = await hospitalModel.findByIdAndDelete(userId);
}

if (!user) {
  return res.status(404).json({ message: 'User not found' });
}

res.status(200).json({ message: 'User deleted successfully' });
}
catch (err) {
  console.error("Error deleting user:", err);
  res.status(500).json({ message: 'Error deleting user' });
}
}



exports.verifyKYC = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await hospital.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isKYCVerified = true;
    await user.save();

    res.status(200).json({ message: 'KYC approved' });
  } catch (err) {
    res.status(500).json({ message: 'Error approving KYC' });
  }
};
