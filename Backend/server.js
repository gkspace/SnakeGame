const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../Front-end')));

app.use(express.json());

// Placeholder leaderboard, you should replace this with a database
let leaderboard = [];

app.get('/leaderboard', (req, res) => {
    res.json(leaderboard);
});

app.post('/leaderboard', (req, res) => {
    const { name, score } = req.body;
    addScore(name, score);
    res.status(201).send('Score added successfully');
});

// Serve the index.html file for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Front-end/index.html'));
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

function addScore(name, score) {
    leaderboard.push({ name, score });
    leaderboard.sort((a, b) => b.score - a.score); // Sort by score descending
    if (leaderboard.length > 10) leaderboard.pop(); // Keep only top 10 scores
}
