import { BoardShape, EmptyCell } from "../../../../types";

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 16;

export enum Directions {
  RightTop = "right_top",
  RightBottom = "right_bottom",
  LeftTop = "left_top",
  LeftBottom = "left_bottom",
}
export function getEmptyBoard(height = BOARD_HEIGHT): BoardShape {
  return Array(height)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(EmptyCell.Empty));
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

export const getDirection = (direction: Directions) => {
  switch (direction) {
    case Directions.RightTop: {
      return { column: 1, row: -1 };
    }
    case Directions.RightBottom: {
      return { column: 1, row: 1 };
    }
    case Directions.LeftTop: {
      return { column: -1, row: -1 };
    }
    case Directions.LeftBottom: {
      return { column: -1, row: 1 };
    }
    default: {
      return { row: 0, column: 0 };
    }
  }
};

export const getNewBallPosition = (ball: number[], direction: Directions) => {
  const { row, column } = getDirection(direction);
  let newRow = ball[0] + row;
  let newColumn = ball[1] + column;
  return [newRow, newColumn];
};
