import { getInputDirection } from "./input.js";
export let SNAKE_SPEED = 6;

let inputDirection = [];
let newSegments = 0;
const snakeBody = [{ x: 11, y: 11 }];

export function expandSnake(amount) {
  newSegments += amount;
}

function equalPositions(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

function addSegments() {
  for (let i = 0; i < newSegments; i++) {
    snakeBody.push({ ...snakeBody[snakeBody.length - 1] });
  }
  newSegments = 0;
}

//handles snake movement
export function update() {
  addSegments();
  inputDirection = getInputDirection();
  //   console.log(inputDirection);

  for (let i = snakeBody.length - 2; i >= 0; i--) {
    snakeBody[i + 1] = { ...snakeBody[i] };
  }

  snakeBody[0].y += inputDirection.y;
  snakeBody[0].x += inputDirection.x;
}

export function getSnakeHead() {
  return snakeBody[0];
}

export function onSnake(position) {
  return equalPositions(position, getSnakeHead());
}

export function snakeIntersection() {
  let newSnakeHead = getSnakeHead();
  return snakeBody.some((segment, index) => {
    if (index != 0) {
      return equalPositions(segment, newSnakeHead);
    }
  });
}

//handles snake render
export function draw(gameBoard) {
  snakeBody.forEach((segment) => {
    const snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = segment.y;
    snakeElement.style.gridColumnStart = segment.x;
    // snakeElement.innerHTML = `x${segment.x} y${segment.y}`;
    snakeElement.classList.add("snake");
    gameBoard.appendChild(snakeElement);
  });
}
