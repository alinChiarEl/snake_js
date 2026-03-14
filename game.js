import {
  update as updateSnake,
  draw as drawSnake,
  SNAKE_SPEED,
  getSnakeHead,
  snakeIntersection,
} from "./snake.js";

import { update as updateFood, draw as drawFood } from "./food.js";
import { outsideGrid } from "./grid.js";

let pauseModal = document.querySelector("#pauseModal");

function openModal(modal) {
  modal.classList.add("active");
}
function closeModal(modal) {
  modal.classList.remove("active");
}

let gameOver = false;
let secondsSinceLastRender = 0;
let lastTimestamp = 0;
let gameBoard = document.querySelector("#game-board");
let running = true;
export function toggleRunning() {
  running = !running;
  console.log(running);
}

function main(currentTimestamp) {
  if (gameOver) {
    if (confirm("You lost. Press ok to restart")) {
      window.location = window.location.href;
    }
    return;
  }

  //display a modal showing to the user that the game is currently paused.
  if (!running) {
    openModal(pauseModal);
  } else {
    closeModal(pauseModal);
  }

  requestAnimationFrame(main);

  secondsSinceLastRender = (currentTimestamp - lastTimestamp) / 1000;

  if (Math.floor(secondsSinceLastRender < 1 / SNAKE_SPEED)) return;

  if (running) {
    update();
    draw();
  }

  lastTimestamp = currentTimestamp;
  //   console.log(secondsSinceLastRender);
}

requestAnimationFrame(main);

function update() {
  updateSnake();
  updateFood();
  checkDeath();
}

function draw() {
  gameBoard.innerHTML = "";
  drawSnake(gameBoard);
  drawFood(gameBoard);
}

function checkDeath() {
  gameOver = outsideGrid(getSnakeHead()) || snakeIntersection();
}
