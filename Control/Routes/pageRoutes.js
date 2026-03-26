const express = require('express');
const router = express.Router();

const pageController = require('../Controller/pageController');
router.get('/', pageController.homePage);
module.exports = router;