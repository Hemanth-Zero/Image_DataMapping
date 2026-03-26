const path = require('path');

const homePage = (req, res) => {
    res.redirect('/user/login');
}

module.exports = { homePage };