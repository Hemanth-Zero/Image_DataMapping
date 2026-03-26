const express = require('express');
const router = express.Router();
const { loginPage, registerPage } = require('../Controller/userController');

// User routes - POST requests for form submissions
router.post('/login', loginPage);
router.post('/register', registerPage);

module.exports = router;