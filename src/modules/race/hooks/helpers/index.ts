import {
  BoardShape,
  DefaultShape,
  EmptyCell,
  RaceCell,
} from "../../../../types";

export const BOARD_WIDTH = 11;
export const BOARD_HEIGHT = 16;

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
    ![EmptyCell.Empty].includes(dot)
  ) {
    hasCollision = true;
  }
  return hasCollision;
}

export function getCrashBlock() {
  return [RaceCell.CrashEmpty, RaceCell.CrashFire][
    Math.floor(Math.random() * 2)
  ];
}

export function addShapeToBoard(
  board: BoardShape,
  car: DefaultShape,
  otherCars: number[][][],
  leftBoard: DefaultShape,
  rightBoard: DefaultShape,
  crashBlock: DefaultShape
) {
  (otherCars || []).forEach((car) => {
    car.forEach(([row, column]) => {
      board[row][column] = RaceCell.Block;
    });
  });
  rightBoard.forEach(([row, column]) => {
    board[row][column] = RaceCell.Block;
  });
  leftBoard.forEach(([row, column]) => {
    board[row][column] = RaceCell.Block;
  });
  if (crashBlock.length) {
    crashBlock.forEach(([row, column]) => {
      board[row][column] = getCrashBlock();
      board[row][column + 1] = getCrashBlock();
      board[row][column - 1] = getCrashBlock();
    });
  } else {
    car.forEach(([row, column]) => {
      board[row][column] = RaceCell.Block;
    });
  }
}
