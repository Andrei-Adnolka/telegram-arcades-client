import { BoardShape, EmptyCell, FoodCell, SnakeShape } from "../../../../types";

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 16;

export function isEatingHerself(
  snake: SnakeShape,
  newRow: number,
  newColumn: number
) {
  let isEatingHerself = false;

  if (snake.length > 2) {
    snake.forEach(([elRow, elCol], i) => {
      if (elRow === newRow && elCol === newColumn && i !== 1) {
        isEatingHerself = true;
      }
    });
  }

  return isEatingHerself;
}

export function getRandomFood(snake: SnakeShape): [number, number] {
  let row = Math.floor(Math.random() * BOARD_HEIGHT);
  let column = Math.floor(Math.random() * BOARD_WIDTH);

  let isUnique = true;

  snake.forEach(([elRow, elCol]) => {
    if (elRow === row && elCol === column) {
      isUnique = false;
    }
  });
  if (isUnique) {
    return [row, column];
  }
  return getRandomFood(snake);
}

export function getEmptyBoard(
  height = BOARD_HEIGHT,
  food?: number[]
): BoardShape {
  return Array(height)
    .fill(null)
    .map((_, heightIndex) => {
      const array = Array(BOARD_WIDTH).fill(EmptyCell.Empty);
      if (!food || heightIndex !== food[0]) {
        return array;
      }
      array[food[1]] = "Food";
      return array;
    });
}

export function getSnakeData(snake: SnakeShape) {
  const head = snake[snake.length - 1];
  return {
    snakesHeadRow: head[0],
    snakesHeadColumn: head[1],
    snake,
  };
}

export function getBoardWithFood(snake?: SnakeShape) {
  return getEmptyBoard(BOARD_HEIGHT, snake ? getRandomFood(snake) : undefined);
}

export function isEating(
  board: BoardShape,
  row: number,
  column: number
): boolean {
  return board?.[row]?.[column] === FoodCell.Food;
}

export function hasCollisions(
  board: BoardShape,
  row: number,
  column: number
): boolean {
  let hasCollision = false;
  const dot = board?.[row]?.[column];

  if (
    row >= board.length ||
    column >= board[0].length ||
    column < 0 ||
    // @ts-ignore
    ![EmptyCell.Empty, FoodCell.Food].includes(dot)
  ) {
    hasCollision = true;
  }
  return hasCollision;
}
