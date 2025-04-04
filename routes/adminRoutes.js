const express = require('express');
const router = express.Router();
const { viewUsers, deleteUser, approveKYC } = require('../controller/adminController');

router.get('/users', viewUsers);
router.delete('/user/:userId', deleteUser);
router.put('/approve-kyc/:userId', approveKYC);

module.exports = router;
