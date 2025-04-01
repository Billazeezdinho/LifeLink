const router = require('express').Router();
const { register, login } = require('../controller/userController');
const { registerValidate } = require('../middleware/validate');

router.post('/donor/register', registerValidate, register);
router.post('/donor/login', login);

module.exports = router;