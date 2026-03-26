const path = require('path');

const homePage = (req, res) => {
    res.sendFile(path.join(__dirname, '../../View/login.html'));
}

module.exports = { homePage };