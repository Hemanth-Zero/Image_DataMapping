const express = require('express');
const router = express.Router();
const pageController = require('../Controller/pageController');
const { loginPage, registerPage } = require('../Controller/userController');

// Page routes - GET requests to display pages
router.get('/', pageController.homePage);
router.get('/login', loginPage);
router.get('/register', registerPage);
router.get('/dashboard', pageController.dashboardPage);
router.get('/annotation', pageController.annotationPage);

module.exports = router;
