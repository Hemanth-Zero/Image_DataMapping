const express = require('express');
const router = express.Router();
const { loginPage, registerPage, annotationPage } = require('../Controller/userController');

// User page routes
router.get('/login', loginPage);
router.get('/register', registerPage);
router.get('/annotation', annotationPage);

module.exports = router;