const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Simple user database
const users = [
    { username: 'admin', password: 'admin' }
];

// In-memory feedback storage
const fs = require('fs');
const feedbackFilePath = path.join(__dirname, 'feedback.json');

let feedbackData = [];
if (fs.existsSync(feedbackFilePath)) {
    feedbackData = JSON.parse(fs.readFileSync(feedbackFilePath, 'utf8'));
}

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
    if (req.cookies.session) {
        const user = users.find(u => u.username === req.cookies.session);
        if (user) {
            return next();
        }
    }
    res.redirect('/login.html');
};

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/about.html'));
});

app.get('/apps', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/apps.html'));
});

app.get('/expenses', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/expenses.html'));
});

app.get('/feedback', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/feedback.html'));
});

app.get('/calculator', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/calculator.html'));
});

app.get('/info', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/info.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.get('/view-feedback.html', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/view-feedback.html'));
});

// Login Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.cookie('session', username, { maxAge: 900000, httpOnly: true });
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    fs.writeFileSync(feedbackFilePath, JSON.stringify(feedbackData, null, 2));
    res.json({ message: 'Feedback saved successfully!' });
});

// Handle Feedback Submission
app.post('/submit-feedback', isAuthenticated, (req, res) => {
    const feedback = req.body;
    feedbackData.push(feedback);
    res.json({ message: 'Feedback saved successfully!' });
});

// Get Feedback
app.get('/get-feedback', isAuthenticated, (req, res) => {
    res.json(feedbackData);
});

// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
