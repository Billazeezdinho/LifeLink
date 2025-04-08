const express = require("express");
const router = express.Router();
const { adminRegister, adminLogin, viewUsers, deleteUser, verifyKYC } = require("../controller/adminController");
const  authenticateAdmin  = require("../middleware/authMiddleware");  // Authentication middleware


// Admin Register (Public route)
router.post("/register", adminRegister);

// Admin Login (Public route)
router.post("/login", adminLogin);

// Admin actions - protected by authentication middleware
router.get("/users", authenticateAdmin, viewUsers); // View all users (Admin only)
router.delete("/delete/:userId", authenticateAdmin, deleteUser); // Delete user (Admin only)
router.put("/verify-kyc/:hospitalId", authenticateAdmin, verifyKYC); // Verify Hospital KYC (Admin only)

module.exports = router;
