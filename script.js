const player = document.getElementById("player");
const scoreElement = document.getElementById("score");
const highscoreElement = document.getElementById("highscore");
const container = document.getElementById("game-container");
const pauseBtn = document.getElementById("pause-btn");
const pauseOverlay = document.getElementById("pause-overlay");

let score = 0;
let speed = 6;
let isGameOver = false;
let isPaused = false;
let highscore = localStorage.getItem("cyberRecord") || 0;
highscoreElement.innerText = highscore;

function togglePause(e) {
    if (isGameOver) return;
    
    // Se o evento existir, impede que o clique "vaze" para o container do jogo
    if (e && e.stopPropagation) e.stopPropagation();

    isPaused = !isPaused;
    if (isPaused) {
        container.classList.add("paused");
        pauseOverlay.style.display = "flex";
        pauseBtn.innerText = "RESUME (P)";
    } else {
        container.classList.remove("paused");
        pauseOverlay.style.display = "none";
        pauseBtn.innerText = "PAUSE (P)";
    }
}

function jump() {
    if (!player.classList.contains("jump") && !isGameOver && !isPaused) {
        player.classList.add("jump");
        setTimeout(() => player.classList.remove("jump"), 600);
    }
}

function spawnObstacle() {
    if (isGameOver) return;
    if (isPaused) {
        setTimeout(spawnObstacle, 100);
        return;
    }

    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    container.appendChild(obstacle);

    let pos = 600;
    let timer = setInterval(() => {
        if (isGameOver) { clearInterval(timer); return; }
        if (!isPaused) {
            pos -= speed;
            obstacle.style.left = pos + "px";

            let pBottom = parseInt(window.getComputedStyle(player).bottom);
            if (pos > 50 && pos < 95 && pBottom < 55) {
                endGame();
            }

            if (pos < -40) {
                clearInterval(timer);
                container.removeChild(obstacle);
                score++;
                scoreElement.innerText = score;
                if (score % 5 === 0) speed += 0.8;
            }
        }
    }, 20);

    let nextSpawn = Math.random() * 1500 + (1000 - speed * 20);
    setTimeout(spawnObstacle, Math.max(700, nextSpawn));
}

function endGame() {
    isGameOver = true;
    if (score > highscore) localStorage.setItem("cyberRecord", score);
    alert("CONEXÃO PERDIDA! Score: " + score);
    location.reload();
}

document.addEventListener("keydown", (e) => { 
    if(e.code === "Space" || e.code === "ArrowUp") jump(); 
    if(e.code === "KeyP") togglePause(e);
});

pauseBtn.addEventListener("mousedown", (e) => {
    togglePause(e);
});

container.addEventListener("mousedown", (e) => {
    if (e.target === pauseBtn) return;
    jump();
});


spawnObstacle();