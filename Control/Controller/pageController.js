const path = require('path');

const homePage = (req, res) => {
    res.redirect('/user/login');
}

const dashboardPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../../View/dashboard.html'));
}

const annotationPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../../View/annotation.html'));
}

module.exports = { homePage,dashboardPage, annotationPage };