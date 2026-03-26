const express = require('express');
const router = express.Router();
const { homePage } = require('../Controller/pageController');

// Page routes
router.get('/', homePage);
router.get('/dashboard', dashboardPage);
router.get('/annotation', annotationPage);

module.exports = router;
