const router = require('express').Router();
const { register, login, resetPassword, resetNewPassword, changePassword } = require('../controller/donorController');
const { registerValidate } = require('../middleware/validate');

router.post('/donor/register', registerValidate, register);
router.post('/donor/login', login);
router.patch('/reset', resetPassword);
router.patch('/resetPassword/:id/:token', resetNewPassword);
router.patch('/change', changePassword);

module.exports = router;