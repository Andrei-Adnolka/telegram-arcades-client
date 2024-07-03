import { BoardShape, EmptyCell, FoodCell, SnakeShape } from "../../../../types";

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 16;

export const LEVELS = [
  { level: 1, speed: 630, score: { start: 0, end: 500 } },
  { level: 2, speed: 580, score: { start: 500, end: 1500 } },
  { level: 3, speed: 500, score: { start: 1500, end: 3000 } },
  { level: 4, speed: 450, score: { start: 3000, end: 5000 } },
  { level: 5, speed: 400, score: { start: 5000, end: 7500 } },
  { level: 6, speed: 300, score: { start: 7500, end: 10000 } },
  { level: 7, speed: 200, score: { start: 10000, end: 12500 } },
  { level: 8, speed: 150, score: { start: 12500, end: 14500 } },
  { level: 9, speed: 110, score: { start: 14500, end: 20000 } },
];

export function isEatingHerself(
  snake: SnakeShape,
  newRow: number,
  newColumn: number
) {
  let isEatingHerself = false;

  if (snake.length > 2) {
    snake.forEach(([elRow, elCol]) => {
      if (elRow === newRow && elCol === newColumn) {
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

export const getDirection = (direction: string) => {
  switch (direction) {
    case "right": {
      return { column: 1 };
    }
    case "left": {
      return { column: -1 };
    }
    case "top": {
      return { row: -1 };
    }
    case "bottom": {
      return { row: 1 };
    }
    default: {
      return { row: 0, column: 0 };
    }
  }
};
