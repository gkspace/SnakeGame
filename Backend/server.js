const express = require('express');
const app = express();
app.use(express.json());

app.get('/leaderboard', (req, res) => {
    res.json(leaderboard);
});

app.post('/leaderboard', (req, res) => {
    const { name, score } = req.body;
    addScore(name, score);
    res.status(201).send('Score added successfully');
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

async function addScore(name, score) {
    try {
        const response = await fetch('/leaderboard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, score }),
        });
        if (response.ok) {
            console.log('Score added to server');
        }
    } catch (error) {
        console.error('Failed to add score to server', error);
    }
}

