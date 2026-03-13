import { onSnake, expandSnake } from "./snake.js";
import { randomGridPosition } from "./grid.js";

let food = { x: 9, y: 11 };
const EXPANSION_RATE = 4;

export function update() {
  if (onSnake(food)) {
    food = getRandomFoodPosition();
    expandSnake(EXPANSION_RATE);
  }
}

export function draw(gameBoard) {
  const foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  gameBoard.appendChild(foodElement);
}

function getRandomFoodPosition() {
  let newFoodPosition;
  while (onSnake(newFoodPosition) || newFoodPosition == null) {
    newFoodPosition = randomGridPosition();
  }

  return newFoodPosition;
}
