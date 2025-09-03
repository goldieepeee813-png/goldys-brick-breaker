const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.95;
canvas.height = window.innerHeight * 0.7;

const paddle = {
  width: 120,
  height: 20,
  x: canvas.width / 2 - 60,
  y: canvas.height - 40,
  dx: 0,
  speed: 8
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height - 60,
  radius: 12,
  dx: 4,
  dy: -4
};

const brickRowCount = 5,
      brickColumnCount = 8,
      brickWidth = 80,
      brickHeight = 25,
      brickPadding = 10,
      brickOffsetTop = 50,
      brickOffsetLeft = 35;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

let score = 0, lives = 3;

function drawPaddle() {
  ctx.fillStyle = "gold";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Goldy Porter", paddle.x + paddle.width / 2, paddle.y + paddle.height - 5);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "gold";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.fillStyle = "gold";
        ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
      }
    }
  }
}

function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 10, 25);
}

function drawLives() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Lives: " + lives, canvas.width - 100, 25);
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (ball.x > b.x && ball.x < b.x + brickWidth &&
            ball.y > b.y && ball.y < b.y + brickHeight) {
          ball.dy = -ball.dy;
          b.status = 0;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            alert("YOU WIN, Goldy Porter!");
            document.location.reload();
          }
        }
      }
    }
  }
}

let touchStartX = 0;
canvas.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
});
canvas.addEventListener("touchmove", (e) => {
  const touchX = e.touches[0].clientX;
  const delta = touchX - touchStartX;
  paddle.x += delta;
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
  touchStartX = touchX;
  e.preventDefault();
}, { passive: false });

document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") paddle.dx = paddle.speed;
  if (e.key === "ArrowLeft") paddle.dx = -paddle.speed;
});
document.addEventListener("keyup", e => {
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") paddle.dx = 0;
});

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) ball.dx = -ball.dx;
  if (ball.y - ball.radius < 0) ball.dy = -ball.dy;

  if (ball.y + ball.radius > paddle.y &&
      ball.x > paddle.x &&
      ball.x < paddle.x + paddle.width) ball.dy = -ball.dy;

  if (ball.y + ball.radius > canvas.height) {
    lives--;
    if (!lives) {
      alert("GAME OVER, Goldy Porter!");
      document.location.reload();
    } else {
      ball.x = canvas.width / 2;
      ball.y = canvas.height - 60;
      ball.dx = 4;
      ball.dy = -4;
      paddle.x = canvas.width / 2 - paddle.width / 2;
    }
  }

  paddle.x += paddle.dx;
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;

  requestAnimationFrame(update);
}

update();
