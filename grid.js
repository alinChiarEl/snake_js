const GRID_SIZE = 21;

export function outsideGrid(position) {
  if (
    position.x >= GRID_SIZE ||
    position.x < 0 ||
    position.y >= GRID_SIZE ||
    position.y < 0
  ) {
    return true;
  }
}

export function randomGridPosition() {
  //check that the position returned is not on the snake

  return {
    x: Math.floor(Math.random() * GRID_SIZE + 1),
    y: Math.floor(Math.random() * GRID_SIZE + 1),
  };
}
