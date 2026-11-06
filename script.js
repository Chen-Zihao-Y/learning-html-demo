const gameContainer = document.getElementById("gameContainer");
const player = document.getElementById("player");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const speedEl = document.getElementById("speed");
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreEl = document.getElementById("finalScore");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

let score = 0;
let highScore = localStorage.getItem("dodgeHighScore") || 0;
let gameSpeed = 1;
let isRunning = false;
let playerX;
let obstacles = [];
let gameLoop;
let obstacleSpawner;
let scoreTimer;

highScoreEl.textContent = highScore;

function initGame() {
    score = 0;
    gameSpeed = 1;
    obstacles = [];
    document.querySelectorAll(".obstacle").forEach(obs => obs.remove());

    playerX = gameContainer.clientWidth / 2;
    player.style.left = playerX + "px";

    scoreEl.textContent = score;
    speedEl.textContent = gameSpeed.toFixed(1);
}

function startGame() {
    initGame();
    isRunning = true;
    startScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");

    gameLoop = requestAnimationFrame(update);

    obstacleSpawner = setInterval(() => {
        if (isRunning) spawnObstacle();
    }, 900);

    scoreTimer = setInterval(() => {
        if (isRunning) {
            score++;
            scoreEl.textContent = score;

            if (score % 10 === 0) {
                gameSpeed += 0.15;
                speedEl.textContent = gameSpeed.toFixed(1);
            }
        }
    }, 1000);
}

function spawnObstacle() {
    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");

    const maxX = gameContainer.clientWidth - 40;
    const x = Math.random() * maxX;

    obstacle.style.left = x + "px";
    obstacle.style.top = "-40px";

    gameContainer.appendChild(obstacle);

    obstacles.push({
        element: obstacle,
        x: x,
        y: -40
    });
}

function update() {
    if (!isRunning) return;

    const speed = 4 * gameSpeed;

    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.y += speed;
        obs.element.style.top = obs.y + "px";

        if (checkCollision(obs)) {
            gameOver();
            return;
        }

        if (obs.y > gameContainer.clientHeight) {
            obs.element.remove();
            obstacles.splice(i, 1);
        }
    }

    gameLoop = requestAnimationFrame(update);
}

function checkCollision(obs) {
    const playerRect = player.getBoundingClientRect();
    const obsRect = obs.element.getBoundingClientRect();

    const padding = 6;

    return !(
        playerRect.right - padding < obsRect.left + padding ||
        playerRect.left + padding > obsRect.right - padding ||
        playerRect.bottom - padding < obsRect.top + padding ||
        playerRect.top + padding > obsRect.bottom - padding
    );
}

function gameOver() {
    isRunning = false;
    cancelAnimationFrame(gameLoop);
    clearInterval(obstacleSpawner);
    clearInterval(scoreTimer);

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("dodgeHighScore", highScore);
        highScoreEl.textContent = highScore;
    }

    finalScoreEl.textContent = score;
    gameOverScreen.classList.remove("hidden");
}

function movePlayer(direction) {
    if (!isRunning) return;

    const step = 30;
    const maxX = gameContainer.clientWidth - 50;

    if (direction === "left") {
        playerX = Math.max(10, playerX - step);
    } else if (direction === "right") {
        playerX = Math.min(maxX, playerX + step);
    }

    player.style.left = playerX + "px";
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        movePlayer("left");
    } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        movePlayer("right");
    }
});

gameContainer.addEventListener("touchstart", (e) => {
    if (!isRunning) return;
    const touch = e.touches[0];
    const rect = gameContainer.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;

    if (touchX < rect.width / 2) {
        movePlayer("left");
    } else {
        movePlayer("right");
    }
});

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
