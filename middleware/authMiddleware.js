const jwt = require("jsonwebtoken");
const { donorModel } = require("../model/donorModel");
const hospitalModel = require('../model/hospitalModel'); 
const adminModel = require('../model/adminModel');
const { transactionModel } = require('../model/transactionModel');
const blacklistedTokens = new Set();

const auth = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    
    // Check if token is blacklisted
    if (blacklistedTokens.has(token)) {
      return res.status(401).json({ message: ` ${req.user} logged out. Please log in again.` });
    }
  
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.key); // Use a more descriptive variable name for the secret
    console.log('Decode',decoded)
    let user;

    // Check which model the user belongs to (donor, hospital, or admin)
    user = (await donorModel.findById(decoded.id)) || 
           (await hospitalModel.findById(decoded.id)) || 
           (await adminModel.findById(decoded.id));
           console.log('User',user)
    // If user is not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach the user to the request object for use in subsequent middleware
    req.user = user;
    next();
  } catch (error) {
   
    res.status(401).json({ message: "Authentication failed: " + error.message });
  }
};

// Middleware for role-based authorization
const roleAuth = (allowedRoles) => {
  return (req, res, next) => {
    console.log('Here')
    try {
      
      console.log(req.user.role)
      const userRole = req.user.role;
      
      // Check if the user's role is allowed
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: "Access denied " });
      }

      next();
    } catch (error) {
      
      res.status(500).json({ message: "Role authentication failed: " + error.message });
    }
  };
}

const hospitalMustBePaid = async (req, res, next) => {
  try {
    const hospitalId = req.user.id; 

    const payment = await transactionModel.findOne({
      hospital: hospitalId,
      status: 'success'
    });

    if (!payment) {
      return res.status(403).json({
        message: 'Access Denied: Please complete payment to continue.'
      });
    }

    next(); 
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: 'Internal server error ' + error.message
    });
  }
};


module.exports = {
  auth,
  roleAuth,
  blacklistedTokens,
  hospitalMustBePaid
};