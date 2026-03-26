const path = require('path');

const loginPage = (req, res) => {
    // GET request - serve login page
    if (req.method === 'GET') {
        res.sendFile(path.join(__dirname, '../../View/login.html'));
    }
    // POST request - handle login and redirect to dashboard
    else if (req.method === 'POST') {
        // TODO: Add authentication logic here
        // For now, just redirect to dashboard
        res.redirect('/dashboard');
    }
}

const registerPage = (req, res) => {
    // GET request - serve register page (login.html with register form visible)
    if (req.method === 'GET') {
        res.sendFile(path.join(__dirname, '../../View/login.html'));
    }
    // POST request - handle registration and redirect to dashboard
    else if (req.method === 'POST') {
        // TODO: Add registration logic here
        // For now, just redirect to dashboard
        res.redirect('/dashboard');
    }
}

const annotationPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../../View/annotation.html'));
}

module.exports = { loginPage, registerPage, annotationPage };
