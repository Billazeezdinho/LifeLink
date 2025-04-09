const jwt = require("jsonwebtoken");
const donorModel = require("../model/donorModel");
const hospitalModel = require('../model/hospitalModel'); 
const adminModel = require('../models/adminModel');

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;




exports.blacklistedTokens = new Set();
exports.auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token){ 
      return res.status(401).json({ 
      message: "No token provided" 
    })};
    if (blacklistedTokens.has(token)) {
      return res.status(401).json({ 
        message: "Token has been invalidated. Please log in again." 
      });
    }
    const decoded = jwt.verify(token, process.env.key
    );
    let user;
    user = (await donorModel.findById(decoded.id)) || (await hospitalModel.findById(decoded.id)) || (await adminModel.findById(decoded.id));
    if (!user){
      return res.status(404).json({ 
        message: "User not found" 
      })};
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
    message: "Authentication failed", error
   });
  }
};
exports.roleAuth = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user.role;
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ 
          message: "Access denied: insufficient permissions" 
        });
      }
      next();
    } catch (error) {
      res.status(500).json({ 
        message: "Role authentication failed", error 
      });
    }
  };
};


