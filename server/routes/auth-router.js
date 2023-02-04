const express = require('express');
const router = express.Router();

const {
    signupValidator,
    loginValidator
} = require('../utils/validators/authValidator')

const {
    signup,
    login
} = require('../controllers/auth-controller')

// router.get('/api/auth/github' , registerUser);
router.post('/signup' , signupValidator , signup);
router.post('/login', loginValidator , login);

module.exports = router;