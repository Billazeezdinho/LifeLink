const express = require("express");
const router = express.Router();

const {
  adminRegister,
  adminLogin,
  viewUsers,
  deleteUser,
  approveKYC,
  declineKYC,
  forgotPassword,
  resetPassword,
  getAllKYCSubmissions,
} = require("../controller/adminController");

// Import all middleware from the file
const { auth, roleAuth } = require("../middleware/authMiddleware");

//  Public routes
/**
 * @swagger
 * /admin/newRegister:
 *   post:
 *     summary: Register a new admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - fullName
 *               - email
 *               - role
 *               - password
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/admin/newRegister", adminRegister);

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Admin logged in successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.post("/admin/login", adminLogin);

/**
 * @swagger
 * /admin/forgotPassword:
 *   post:
 *     summary: Send password reset email to admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset link sent
 *       400:
 *         description: Invalid email format or missing email
 *       500:
 *         description: Internal server error
 */
router.post("/admin/forgotPassword", forgotPassword);

/**
 * @swagger
 * /admin/resetPassword:
 *   post:
 *     summary: Reset admin password
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, newPassword]
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid or expired token
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.post("/admin/resetPassword", auth, roleAuth(["admin"]), resetPassword);
/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (donors and hospitals)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get("/admin/users", auth, roleAuth(["admin"]), viewUsers);

/**
 * @swagger
 * /admin/delete/{userId}:
 *   delete:
 *     summary: Delete a user (either donor or hospital)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.delete("/admin/delete/:userId", auth, roleAuth(["admin"]), deleteUser);

/**
 * @swagger
 * /admin/verify-kyc/{kycId}:
 *   patch:
 *     summary: Approve KYC for a hospital
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: kycId
 *         required: true
 *         description: The KYC ID to approve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: KYC approved successfully
 *       400:
 *         description: KYC has already been processed
 *       404:
 *         description: KYC not found
 *       500:
 *         description: Internal server error
 */
router.patch("/admin/verify-kyc/:kycId", auth, roleAuth(["admin"]), approveKYC);

/**
 * @swagger
 * /admin/decline-kyc/{kycId}:
 *   patch:
 *     summary: Decline KYC for a hospital
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: kycId
 *         required: true
 *         description: The KYC ID to decline
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: KYC declined successfully
 *       400:
 *         description: Cannot decline KYC in its current state
 *       404:
 *         description: KYC not found
 *       500:
 *         description: Internal server error
 */
router.patch("/admin/decline-kyc/:kycId", auth, roleAuth(["admin"]), declineKYC);

/**
 * @swagger
 * /admin/allKyc:
 *   get:
 *     summary: Get all KYC submissions
 *     tags: [Admin KYC]
 *     security:
 *       - bearerAuth: []
 *     description: Admin can view all KYC submissions including hospital details and KYC documents.
 *     responses:
 *       200:
 *         description: KYC submissions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: KYC submissions retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 661b31297f6d2ab89b6d9c0e
 *                       hospital:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                       facilityImage:
 *                         type: string
 *                         format: uri
 *                         example: https://res.cloudinary.com/yourcloud/image/upload/facility.jpg
 *                       accreditedCertificate:
 *                         type: string
 *                         format: uri
 *                       utilityBill:
 *                         type: string
 *                         format: uri
 *                       licenseNumber:
 *                         type: string
 *                         example: L12345XYZ
 *                       status:
 *                         type: string
 *                         enum: [pending, approved, declined]
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - Admins only
 *       500:
 *         description: Server error
 */

router.get('/admin/allKyc', auth, roleAuth(["admin"]),getAllKYCSubmissions);

module.exports = router;
