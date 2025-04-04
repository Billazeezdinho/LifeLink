const router = require('express').Router();
const { register, login, resetNewPassword, changePassword, forgotPassword, getAllDonor } = require('../controller/donorController');
const { registerValidate } = require('../middleware/validate');

router.post('/donor/register', registerValidate, register);
router.post('/donor/login', login);
router.patch('/forgot', forgotPassword);
router.patch('/resetPassword/:token', resetNewPassword);
router.patch('/change', changePassword);
router.get('/donors', getAllDonor)

module.exports = router;