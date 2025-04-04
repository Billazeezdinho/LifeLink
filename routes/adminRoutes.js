const express = require('express');
const router = express.Router();
const { viewUsers, deleteUser, approveKYC } = require('../controller/adminController');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: View all users
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all users retrieved successfully
 *       500:
 *         description: Internal Server Error
 */
router.get('/users', async (req, res) => {
  try {
    await viewUsers(req, res);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /user/{userId}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/user/:userId', async (req, res) => {
  try {
    await deleteUser(req, res);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /approve-kyc/{userId}:
 *   put:
 *     summary: Approve KYC for a user
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose KYC is being approved
 *     responses:
 *       200:
 *         description: KYC approved successfully
 *       400:
 *         description: KYC already approved or invalid request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/approve-kyc/:userId', async (req, res) => {
  try {
    await approveKYC(req, res);
  } catch (error) {
    console.error("Error approving KYC:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
