//define grid

//configurable
let totalCols = 30; // the grid size is square, for now. Maybe i will make it a different size in the future
let minSquareSize = "10px";
let snakeSpeed = 4; //the speed is inverse to 1/s. So speed 5 = 5 squares per second
let target = []; //this is the position of the target
let doNotDeleteTail = 0; //a flag which we set to 1 when we eat a target, to increase snake size by 1.
let score = 0;
let lastTime = 0; //needed for request animation frame
document.getElementById("score").innerHTML = score;
let lastRenderTime = 0;
let delta = 0; //the time interval on which we want the game loop to run(every second)
let currentKey = "";
let keyPressDuration = 100;

const mobileDirections = document.querySelectorAll(".mobileDirection");
const start = document.getElementById("start");
const pause = document.getElementById("pause");

function mobileDirectionHandler(e) {
  switch (e.currentTarget.id) {
    case "up":
      if (snakeDirection == "Up" || snakeDirection == "Down") {
        return;
      }
      move.play();
      snakeDirection = "Up";
      currentKey = e.currentTarget;
      currentKey.classList.add("keypress");

      setTimeout(() => {
        currentKey.classList.remove("keypress");
      }, keyPressDuration);

      break;
    case "down":
      if (snakeDirection == "Up" || snakeDirection == "Down") {
        return;
      }
      move.play();
      snakeDirection = "Down";
      currentKey = e.currentTarget;
      currentKey.classList.add("keypress");

      setTimeout(() => {
        currentKey.classList.remove("keypress");
      }, keyPressDuration);

      break;

    case "left":
      if (snakeDirection == "Left" || snakeDirection == "Right") {
        return;
      }
      move.play();
      snakeDirection = "Left";
      currentKey = e.currentTarget;
      currentKey.classList.add("keypress");

      setTimeout(() => {
        currentKey.classList.remove("keypress");
      }, keyPressDuration);

      break;

    case "right":
      if (snakeDirection == "Right" || snakeDirection == "Left") {
        return;
      }
      move.play();
      snakeDirection = "Right";
      currentKey = e.currentTarget;
      currentKey.classList.add("keypress");

      setTimeout(() => {
        currentKey.classList.remove("keypress");
      }, keyPressDuration);
      break;
  }
}

//sounds for snake movement
const gameover = document.getElementById("gameover");
const move = document.getElementById("move");
const food = document.getElementById("food");

//buttons and modal
const modal = Modal(document.getElementById("root"), {
  width: 200,
  height: 200,
  title: "Game Over",
  closed: false,
  closable: true,
  draggable: true,
  position: "center",
});

const restartBtn = document.getElementById("restartBtn");
//also listens to r key
restartBtn.addEventListener("click", restart);
document.addEventListener("keydown", keyDownControls);

const root = document.documentElement;
root.style.setProperty("--square-size", minSquareSize);
root.style.setProperty("--items-per-line", totalCols);

snake = []; //2 dim array, it increases in time
snakeHead = []; //1 dim array
newSnakeHead = []; //we determine this before actually moving the snake to see if the new position is valid
snakeDirection = "Right"; //can be Left, Right, Up, Down
const grid = document.querySelector(".grid-container");
let items = [];
let availablePositions = [];
let moveSnakeId = 0; //this will be the handler for the moveSnake setInterval function

let snakeState = "paused"; //or moving

const toastNotification = document.getElementById("toastNotification");

function testMovingInCircles(x, y) {
  if (x == 0 && y == 9) {
    snakeDirection = "Down";
  }
  if (x == 9 && y == 9) {
    snakeDirection = "Left";
  }
  if (x == 9 && y == 0) {
    snakeDirection = "Up";
  }
  if (x == 0 && y == 0) {
    snakeDirection = "Right";
  }
}

// game.js

//game controls
function keyDownControls(e) {
  if (e.code == "Space") {
    if (snakeState == "moving") {
      pauseGameLoop();
      showToast("Pause Game");
    }
  }

  //keydown R = Restart Game
  if (e.key == "r") {
    restartBtn.click();
  }

  if (e.key == "Enter") {
    if (snakeState == "paused" && modal.closed) {
      snakeState = "moving";
      console.log("*** Resume Game ***");
    }
  }

  if (e.key == "ArrowLeft") {
    if (snakeDirection == "Right" || snakeDirection == "Left") {
      console.log("can not do this");
      return;
    }
    move.play();
    snakeDirection = "Left";
  }
  if (e.key == "ArrowRight") {
    if (snakeDirection == "Left" || snakeDirection == "Right") {
      return;
    }
    move.play();
    snakeDirection = "Right";
  }
  if (e.key == "ArrowDown") {
    if (snakeDirection == "Up" || snakeDirection == "Down") {
      return;
    }
    move.play();
    snakeDirection = "Down";
  }
  if (e.key == "ArrowUp") {
    if (snakeDirection == "Down" || snakeDirection == "Up") {
      return;
    }
    move.play();
    snakeDirection = "Up";
  }
}

//mobile controls
start.addEventListener("click", () => {
  if (snakeState == "paused" && modal.closed) {
    snakeState = "moving";
    console.log("*** Resume Game ***");
    pause.classList.remove("hidden");
    start.classList.add("hidden");

    currentKey = pause;
    currentKey.classList.add("keypress");

    setTimeout(() => {
      currentKey.classList.remove("keypress");
    }, keyPressDuration);
  }
});

pause.addEventListener("click", () => {
  if (snakeState == "moving") {
    pauseGameLoop();
    showToast("Pause Game");
    pause.classList.add("hidden");
    start.classList.remove("hidden");

    currentKey = start;
    currentKey.classList.add("keypress");

    setTimeout(() => {
      currentKey.classList.remove("keypress");
    }, keyPressDuration);
  }
});

mobileDirections.forEach((e) => {
  e.addEventListener("click", mobileDirectionHandler);
});

function resetScore() {
  score = 0;
  document.getElementById("score").innerHTML = 0;
}

function increaseScore() {
  score++;
  document.getElementById("score").innerHTML = score;
}

//show in-game messages on the bottom of the screen
function showToast(message = "test") {
  console.log(`*** ${message} ***`);

  toastNotification.classList.add("show");
  toastNotification.innerHTML = message;

  setTimeout(() => {
    toastNotification.classList.remove("show");
  }, 1500);
}

function pauseGameLoop() {
  snakeState = "paused";
}

function endGame() {
  gameover.play(); //sound
  snakeState = "paused";
  modal.closed = !modal.closed;
  resetScore();
}

function restart() {
  modal.closed = !modal.closed;
  init();
}

function detectCollision() {
  [x, y] = snakeHead;

  if (snakeDirection == "Left") {
    y = y - 1;
  }
  if (snakeDirection == "Right") {
    y = y + 1;
  }
  if (snakeDirection == "Down") {
    x = x + 1;
  }
  if (snakeDirection == "Up") {
    x = x - 1;
  }

  newSnakeHead = [x, y];

  collisiontWithTarget = snake.some(
    ([sx, sy]) => sx === Number(target[0]) && sy === Number(target[1])
  );

  if (collisiontWithTarget) {
    // console.warn("Collision with target");
    food.play();
    removeTarget();
    increaseScore();
    doNotDeleteTail = 1;

    defineTarget(); //define new target
  }

  const contains = snake.some(([sx, sy]) => sx === x && sy === y);
  if (contains) {
    // console.warn("Collision with self");
    return true;
  }

  //collision with wall
  if (x < 0 || x > totalCols - 1 || y < 0 || y > totalCols - 1) {
    return true;
  }

  snakeHead = newSnakeHead;
  return false;
}

// grid.js

function initializeGrid() {
  let row;
  let col;

  let gridHtml = "";

  for (let i = 0; i <= totalCols * totalCols - 1; i++) {
    row = Math.floor(i / totalCols);
    col = i % totalCols;
    colorClass = i % 2 == 0 ? "lighter" : "darker";

    gridHtml += `<div data-x="${row}" data-y=${col} class = "item  ${colorClass}"> 
    
    </div>`;
  }

  grid.innerHTML = gridHtml;

  items = document.querySelectorAll(".item"); //we must use this here, after the grid has been generated with js
}

function resetGrid(type = "all") {
  items.forEach((item) => {
    if (type == "all") {
      if (item.classList.contains("snakebody")) {
        item.classList.remove("enter");
      }
      if (item.classList.contains("snakehead")) {
        item.classList.remove("snakehead");
      }
    } else {
      item.classList.remove(`${type}`);
    }
  });
}

// snake.js
function moveSnake(direction) {
  if (snakeState == "pause") return;

  snakeDirection = direction ?? snakeDirection;

  const [x, y] = snakeHead;

  if (!detectCollision()) {
    if (doNotDeleteTail != 0) {
      doNotDeleteTail = 0;
    } else {
      snake.pop();
    }

    snake.unshift(newSnakeHead);
    drawSnakeHead(...newSnakeHead); //html part of setting new head
    drawSnakeHtml();
  } else {
    console.error("end game from moveSnake");
    endGame();
  }

  //move snake function
}
function increaseSnakeSize() {
  let tail = snake[snake.length - 1];
  //the simple way is to just not delete the tail if a collision is detected.
}

function defineSnake() {
  snake = [
    [0, 3],
    [0, 2],
    [0, 1],
    [0, 0],
  ];
  snakeHead = snake[0];
}

function drawSnakeHead(x, y) {
  if (x == undefined) {
    let [x, y] = snakeHead;

    let element = document.querySelector(`[data-x='${x}'][data-y='${y}']`);
    element.classList.add("snakehead");
  } else {
    resetGrid("snakehead");

    let element = document.querySelector(`[data-x='${x}'][data-y='${y}']`);

    element.classList.add("snakehead");
  }
}

function drawSnakeHtml() {
  resetGrid("snakebody");

  snake.forEach((item) => {
    element = document.querySelector(
      `[data-x='${item[0]}'][data-y='${item[1]}']`
    );
    element.classList.add("snakebody");
  });
}
// target.js
function removeTarget() {
  let t = document.querySelector(".target").classList.remove("target");
}

function defineTarget() {
  availablePositions = document.querySelectorAll(".item:not(.snakebody)");
  let e =
    availablePositions[Math.floor(Math.random() * availablePositions.length)];

  e.classList.add("target");

  [target[0], target[1]] = [e.dataset.x, e.dataset.y];
}

function gameLoop(timestamp) {
  delta = timestamp - lastRenderTime;

  if (delta > 1000 / snakeSpeed) {
    // console.log(delta);

    if (snakeState != "paused") {
      moveSnake();
    }
    lastRenderTime = timestamp;
  }

  requestAnimationFrame(gameLoop);
}

//runtime
function init() {
  initializeGrid();
  defineSnake(); //manually defines the snake array and the snake head x,y pair

  //draw
  drawSnakeHtml(); //resets the cells and draws the snake
  drawSnakeHead(...snakeHead); //draw the snake head

  defineTarget(); //put the target on the grid, in a random position
  increaseSnakeSize();
  modal.closed = true;

  snakeDirection = "Right"; //default snake direction
  resetScore();

  //mobile controls
  pause.classList.add("hidden");
  start.classList.remove("hidden");

  requestAnimationFrame(gameLoop);
}

init();
