const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');
const gameWidth = gameCanvas.width;
const gameHeight = gameCanvas.height;
const snakeSize = 10;
let score = 0;
let food = { x: 0, y: 0 };
let snake = [{ x: 50, y: 50 }];
let direction = 'right';
let isGameOver = false;
const gameSpeed = 100; // Speed in milliseconds, higher value means slower snake
let gameLoopInterval;
let leaderboard = [
    { name: 'Alfred', score: 1000 },
    { name: 'Daniel', score: 800 },
    { name: 'Hank', score: 600 }
];

function gameLoop() {
    if (!isGameOver) {
        updateGameState();
        renderGame();
        gameLoopInterval = setTimeout(gameLoop, gameSpeed);
    }
}

function updateGameState() {
    // Update snake position
    const head = { ...snake[0] };
    switch (direction) {
        case 'right': head.x += snakeSize; break;
        case 'left': head.x -= snakeSize; break;
        case 'up': head.y -= snakeSize; break;
        case 'down': head.y += snakeSize; break;
    }
    snake.unshift(head);

    // Check for food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        placeFood();
    } else {
        snake.pop();
    }

    // Check for wall collision
    if (head.x < 0 || head.y < 0 || head.x >= gameWidth || head.y >= gameHeight) {
        endGame();
    }

    // Check for self collision
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            endGame();
        }
    }
}

function renderGame() {
    ctx.clearRect(0, 0, gameWidth, gameHeight);

    // Draw snake
    snake.forEach(segment => {
        ctx.fillStyle = 'green';
        ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
    });

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, snakeSize, snakeSize);

    // Draw score
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, 5, gameHeight - 5);
}

document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowUp': if (direction !== 'down') direction = 'up'; break;
        case 'ArrowDown': if (direction !== 'up') direction = 'down'; break;
        case 'ArrowLeft': if (direction !== 'right') direction = 'left'; break;
        case 'ArrowRight': if (direction !== 'left') direction = 'right'; break;
    }
});

function placeFood() {
    const xMax = gameWidth / snakeSize;
    const yMax = gameHeight / snakeSize;
    let validPosition = false;

    while (!validPosition) {
        food.x = Math.floor(Math.random() * xMax) * snakeSize;
        food.y = Math.floor(Math.random() * yMax) * snakeSize;
        validPosition = true;

        // Ensure food is not placed on the snake
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === food.x && snake[i].y === food.y) {
                validPosition = false;
                break;
            }
        }
    }
}

function endGame() {
    isGameOver = true;
    clearTimeout(gameLoopInterval);
    const playerName = prompt('Game Over! Enter your name:');
    if (playerName) {
        addScore(playerName, score);
        // Assume addScore updates the leaderboard array and then...
        displayLeaderboard(); // Refresh the leaderboard display
    }
    // Optionally reset the game here if needed
    document.getElementById('restartButton').style.display = 'inline';
    // ResetGame();
}
function resetGame() {
    // Reset game state variables
    isGameOver = false;
    score = 0;
    snake = [{ x: 50, y: 50 }]; // Reset snake to initial position
    direction = 'right'; // Reset initial direction
    placeFood(); // Place food in a new position

    // Hide the restart button and start the game loop again
    document.getElementById('restartButton').style.display = 'none';
    gameLoopInterval = setTimeout(gameLoop, gameSpeed); // Assuming gameLoop and gameSpeed are defined elsewhere
}
// Modify displayLeaderboard to always show the leaderboard
function displayLeaderboard() {
    const leaderboardDiv = document.getElementById('leaderboard');
    leaderboardDiv.innerHTML = ''; // Clear previous content

    // Ensure leaderboard is sorted
    leaderboard.sort((a, b) => b.score - a.score);

    // Create and append each entry
    leaderboard.forEach((entry, index) => {
        const entryElement = document.createElement('p');
        entryElement.textContent = `${index + 1}. ${entry.name} - ${entry.score}`;
        leaderboardDiv.appendChild(entryElement);
    });
}


// This function now needs to update the leaderboard array and refresh the display
function addScore(playerName, score) {
    leaderboard.push({ name: playerName, score: score });
    displayLeaderboard(); // Refresh the leaderboard display after adding a new score
}

document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('startButton').style.display = 'none';
    placeFood();
    isGameOver = false;
    score = 0;
    snake = [{ x: 50, y: 50 }];
    direction = 'right';
    gameLoop();
    fetchAndDisplayLeaderboard(); // Ensure leaderboard is displayed when the game starts
});

// Initial fetch of leaderboard when the page loads
async function fetchAndDisplayLeaderboard() {
    try {
        const response = await fetch('/leaderboard');
        if (response.ok) {
            leaderboard = await response.json();
            displayLeaderboard();
        }
    } catch (error) {
        console.error('Failed to fetch leaderboard', error);
    }
}

// Ensure leaderboard is fetched and displayed when the page loads
window.onload = fetchAndDisplayLeaderboard;

document.getElementById('restartButton').addEventListener('click', resetGame);
