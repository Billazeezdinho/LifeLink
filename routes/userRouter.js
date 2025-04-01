const router = require('express').Router();
const { register } = require('../controller/userController');
const { registerValidate } = require('../middleware/validate');

router.post('/user/register', registerValidate, register);

module.exports = router;