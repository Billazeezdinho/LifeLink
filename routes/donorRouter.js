const router = require('express').Router();
const { register, login, resetNewPassword, changePassword, forgotPassword } = require('../controller/donorController');
const { registerValidate } = require('../middleware/validate');

router.post('/donor/register', registerValidate, register);
router.post('/donor/login', login);
router.patch('/forot', forgotPassword);
router.patch('/resetPassword/:token', resetNewPassword);
router.patch('/change', changePassword);

module.exports = router;