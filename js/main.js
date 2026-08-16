const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 40;

let snake, direction, food, changingDirection, game;

// Load images
const snakeSprite = new Image();
snakeSprite.src = 'assets/images/Snake Sprite.png';
const appleSprite = new Image();
appleSprite.src = 'assets/images/apple sprite.png';

// Menu elements
const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");
const countdownEl = document.getElementById("countdown");
const gameOverMenu = document.getElementById("gameOverMenu");
const restartBtn = document.getElementById("restartBtn");

// Keyboard input
document.addEventListener("keydown", event => {
  if (changingDirection) return;
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  changingDirection = true;
});

// Initialize game state
function resetGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = "RIGHT";
  changingDirection = false;
  food = randomFood();
  clearInterval(game);
}

// Countdown function
function startCountdown() {
  menu.style.display = "flex";
  countdownEl.textContent = "3";
  let count = 3;

  const countdownInterval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownEl.textContent = count;
    } else {
      clearInterval(countdownInterval);
      menu.style.display = "none";
      game = setInterval(draw, 100);
    }
  }, 1000);
}

// Start button click
startBtn.addEventListener("click", () => {
  resetGame();
  startBtn.style.display = "none";
  startCountdown();
});

// Restart button click
restartBtn.addEventListener("click", () => {
  gameOverMenu.style.display = "none";
  resetGame();
  startCountdown();
});

// Generate random food
function randomFood() {
  let newFood, collision;
  do {
    collision = false;
    newFood = {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
    for (let part of snake) {
      if (part.x === newFood.x && part.y === newFood.y) {
        collision = true;
        break;
      }
    }
  } while (collision);
  return newFood;
}

// Draw function
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Move head
  let headX = snake[0].x;
  let headY = snake[0].y;
  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  let newHead = { x: headX, y: headY };

  // Wall collision
  if (headX < 0 || headX >= canvas.width || headY < 0 || headY >= canvas.height) {
    clearInterval(game);
    gameOverMenu.style.display = "flex";
    return;
  }

  // Self collision
  for (let part of snake) {
    if (part.x === newHead.x && part.y === newHead.y) {
      clearInterval(game);
      gameOverMenu.style.display = "flex";
      return;
    }
  }

  // Food collision
  if (headX === food.x && headY === food.y) {
    food = randomFood();
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
  changingDirection = false;

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    let sx;
    if (i === 0) {
      sx = 40; // head
      ctx.save();
      ctx.translate(snake[i].x + box / 2, snake[i].y + box / 2);
      let angle = 0;
      if (direction === "RIGHT") angle = 0;
      else if (direction === "LEFT") angle = Math.PI;
      else if (direction === "UP") angle = -Math.PI / 2;
      else if (direction === "DOWN") angle = Math.PI / 2;
      ctx.rotate(angle);
      ctx.drawImage(snakeSprite, sx, 0, 20, 20, -box / 2, -box / 2, box, box);
      ctx.restore();
    } else if (i === snake.length - 1) {
      sx = 0; // tail
      ctx.drawImage(snakeSprite, sx, 0, 20, 20, snake[i].x, snake[i].y, box, box);
    } else {
      sx = 20; // body
      ctx.drawImage(snakeSprite, sx, 0, 20, 20, snake[i].x, snake[i].y, box, box);
    }
  }

  // Draw apple
  ctx.drawImage(appleSprite, food.x, food.y, box, box);
}
