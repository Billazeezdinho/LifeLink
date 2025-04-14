const jwt = require("jsonwebtoken");
const donorModel = require("../model/donorModel");
const hospitalModel = require("../model/hospitalModel");
const adminModel = require("../model/adminModel");

const blacklistedTokens = new Set();

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    if (blacklistedTokens.has(token)) {
      return res.status(401).json({ message: "Token has been invalidated. Please log in again." });
    }
    console.log("JWT_SECRET:", process.env.JWT_SECRET)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Try to find user in all models
    const donor = await donorModel.findById(decoded.id || decoded._id);
    const hospital = await hospitalModel.findById(decoded.id || decoded._id);
    const admin = await adminModel.findById(decoded.id || decoded._id);

    if (!donor && !hospital && !admin) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prepare the user object
    if (donor) {
      req.user = {
        id: donor._id,
        email: donor.email,
        name: donor.name || null,
        role: "donor",
      };
    } else if (hospital) {
      req.user = {
        id: hospital._id,
        hospitalId: hospital._id,
        email: hospital.email,
        name: hospital.name || null,
        role: "hospital",
        isKycVerified: hospital.kycVerified || false,
      };
    } else if (admin) {
      req.user = {
        id: admin._id,
        email: admin.email,
        role: "admin",
      };
    }

    // Optional: If accessing admin route and not admin
    if (req.originalUrl.startsWith("/admin") && req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    console.log("req.user:", req.user); // Debugging
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Authentication failed", error });
  }
};

const roleAuth = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user.role;
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: "Access denied: insufficient permissions",
        });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: "Role authentication failed", error });
    }
  };
};

module.exports = {
  auth,
  roleAuth,
  blacklistedTokens,
};
