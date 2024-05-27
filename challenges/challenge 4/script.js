const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const basket = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 30,
    width: 50,
    height: 20,
    color: '#FFD503',
    speed: 0
};

const heart = {
    x: Math.random() * canvas.width,
    y: 0,
    width: 20,
    height: 20,
    color: "#AF03FF",
    speed: 0.5
};

function drawHeart() {
    ctx.fillStyle = heart.color;
    ctx.beginPath();
    ctx.moveTo(heart.x, heart.y + heart.height / 2);
    ctx.bezierCurveTo(
        heart.x + heart.width / 2, heart.y,
        heart.x + heart.width, heart.y + heart.height / 2,
        heart.x + heart.width / 2, heart.y + heart.height
    );
    ctx.bezierCurveTo(
        heart.x, heart.y + heart.height / 2,
        heart.x - heart.width / 2, heart.y,
        heart.x, heart.y + heart.height / 2
    );
    ctx.closePath();
    ctx.fill();

    // Mirror the other half of the heart
    ctx.beginPath();
    ctx.moveTo(heart.x, heart.y + heart.height / 2);
    ctx.bezierCurveTo(
        heart.x - heart.width / 2, heart.y,
        heart.x - heart.width, heart.y + heart.height / 2,
        heart.x - heart.width / 2, heart.y + heart.height
    );
    ctx.bezierCurveTo(
        heart.x, heart.y + heart.height / 2,
        heart.x + heart.width / 2, heart.y,
        heart.x, heart.y + heart.height / 2
    );
    ctx.closePath();
    ctx.fill();

    // Draw a rotated diamond at the bottom
    ctx.save();
    ctx.translate(heart.x, heart.y + heart.height);
    ctx.rotate(55);
    ctx.fillStyle = '#AF03FF';
    ctx.beginPath();
    ctx.moveTo(-heart.width / 2, 0);
    ctx.lineTo(0, -heart.height / 2);
    ctx.lineTo(heart.width / 2, 0);
    ctx.lineTo(0, heart.height / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

let score = 0;

function drawBasket() {
    ctx.fillStyle = basket.color;
    ctx.fillRect(basket.x, basket.y, basket.width, basket.height);

    // Draw left wall
    ctx.fillStyle = '#FFD503';
    ctx.fillRect(basket.x - 5, basket.y, -5, basket.height);
    ctx.fillRect(basket.x - 5, basket.y, 5, basket.height);

    // Draw right wall
    ctx.fillRect(basket.x + basket.width, basket.y, 5, basket.height);
    ctx.fillRect(basket.x + basket.width, basket.y, 10, basket.height);

    // Increase wall height
    const wallHeightIncrease = basket.height;
    ctx.fillRect(basket.x - 5, basket.y - wallHeightIncrease, -5, wallHeightIncrease);
    ctx.fillRect(basket.x - 5, basket.y - wallHeightIncrease, 5, wallHeightIncrease);
    ctx.fillRect(basket.x + basket.width, basket.y - wallHeightIncrease, 5, wallHeightIncrease);
    ctx.fillRect(basket.x + basket.width, basket.y - wallHeightIncrease, 10, wallHeightIncrease);
}

function updateHeartPosition() {
    heart.y += heart.speed;
    if (heart.y > canvas.height) {
        heart.y = 0;
        heart.x = Math.random() * canvas.width;
    }
}

function detectCatch() {
    if (heart.y + heart.height > basket.y &&
        heart.x > basket.x &&
        heart.x < basket.x + basket.width) {
        score++;
        heart.y = 0;
        heart.x = Math.random() * canvas.width;
    }

    // Detect collision with left wall
    if (heart.y + heart.height > basket.y &&
        heart.x <= basket.x &&
        heart.x + heart.width >= basket.x - 5) {
        score++;
        heart.y = 0;
        heart.x = Math.random() * canvas.width;
    }

    // Detect collision with right wall
    if (heart.y + heart.height > basket.y &&
        heart.x + heart.width >= basket.x + basket.width &&
        heart.x <= basket.x + basket.width + 5) {
        score++;
        heart.y = 0;
        heart.x = Math.random() * canvas.width;
    }

    // Detect collision with top wall
    if (heart.y + heart.height >= basket.y - basket.height &&
        heart.x >= basket.x - 5 &&
        heart.x + heart.width <= basket.x + basket.width + 5) {
        score++;
        heart.y = 0;
        heart.x = Math.random() * canvas.width;
    }
}

function updateBasketPosition(event) {
    const { gamma } = event; // gamma is tilt left-to-right
    basket.speed = gamma * 0.1;

    basket.x += basket.speed;
    if (basket.x < 0) basket.x = 0;
    if (basket.x + basket.width > canvas.width) basket.x = canvas.width - basket.width;
}

function drawScore() {
    ctx.font = '20px Bevellier';
    ctx.fillStyle = '#AF03FF';
    ctx.fillText('Score: ' + score, 8, 20);

    if (score >= 10) {
        ctx.font = '40px Bevellier';
        ctx.fillStyle = '#AF03FF';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
        cancelAnimationFrame(animationId);
    }
}

function restartGame() {
    score = 0;
    basket.x = canvas.width / 2 - 25;
    heart.x = Math.random() * canvas.width;
    heart.y = 0;
    gameLoop();
}

// Disable zooming on the canvas
canvas.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});

canvas.addEventListener('touchmove', function (e) {
    e.preventDefault();
});

canvas.addEventListener('touchend', function (e) {
    e.preventDefault();
});

canvas.addEventListener('click', restartGame);

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBasket();
    drawHeart();
    updateHeartPosition();
    detectCatch();
    drawScore();
    requestAnimationFrame(gameLoop);
}

window.addEventListener('deviceorientation', updateBasketPosition);
gameLoop();

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBasket();
    drawHeart();
    updateHeartPosition();
    detectCatch();
    drawScore();
    requestAnimationFrame(gameLoop);
}

window.addEventListener('deviceorientation', updateBasketPosition);
gameLoop();
