const express = require('express');
const router = express.Router();
const { homePage } = require('../Controller/pageController');

// Page routes
router.get('/', homePage);

module.exports = router;
