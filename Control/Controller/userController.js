const path = require('path');

const loginPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../../View/login.html'));
}

const registerPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../../View/dashboard.html'));
}

const annotationPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../../View/annotation.html'));
}

module.exports = { loginPage, registerPage, annotationPage };
