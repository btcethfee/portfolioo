const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player properties
const player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 50,
    width: 40,
    height: 40,
    speed: 5
};

// Bullets and asteroids arrays
let bullets = [];
let asteroids = [];
let gameOver = false;

// Key listeners
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && player.x > 0) player.x -= player.speed;
    if (event.key === "ArrowRight" && player.x < canvas.width - player.width) player.x += player.speed;
    if (event.key === " ") bullets.push({ x: player.x + 15, y: player.y, speed: 7 });
});

// Game loop
function update() {
    if (gameOver) return;

    // Move bullets
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) bullets.splice(index, 1);
    });

    // Move asteroids
    asteroids.forEach((asteroid, index) => {
        asteroid.y += asteroid.speed;
        if (asteroid.y > canvas.height) gameOver = true;

        // Collision detection
        bullets.forEach((bullet, bulletIndex) => {
            if (
                bullet.x < asteroid.x + asteroid.size &&
                bullet.x + 5 > asteroid.x &&
                bullet.y < asteroid.y + asteroid.size &&
                bullet.y + 10 > asteroid.y
            ) {
                asteroids.splice(index, 1);
                bullets.splice(bulletIndex, 1);
            }
        });
    });

    // Spawn asteroids
    if (Math.random() < 0.02) {
        asteroids.push({
            x: Math.random() * (canvas.width - 30),
            y: 0,
            size: 30,
            speed: 2 + Math.random() * 2
        });
    }
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = "white";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw bullets
    ctx.fillStyle = "red";
    bullets.forEach(bullet => ctx.fillRect(bullet.x, bullet.y, 5, 10));

    // Draw asteroids
    ctx.fillStyle = "gray";
    asteroids.forEach(asteroid => ctx.fillRect(asteroid.x, asteroid.y, asteroid.size, asteroid.size));

    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over!", canvas.width / 2 - 70, canvas.height / 2);
    }
}

// Game loop
function gameLoop() {
    update();
    draw();
    if (!gameOver) requestAnimationFrame(gameLoop);
}

gameLoop();
