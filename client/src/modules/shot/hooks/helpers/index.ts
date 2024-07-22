import {
  BoardShape,
  DefaultShape,
  EmptyCell,
  RaceCell,
} from "../../../../types";

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 16;

export function getEmptyBoard(height = BOARD_HEIGHT): BoardShape {
  return Array(height)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(EmptyCell.Empty));
}

export function addShapeToBoard(
  board: BoardShape,
  space: number[],
  bullets: DefaultShape,
  army: DefaultShape
) {
  const [row, column] = space;
  board[row][column] = RaceCell.Block;

  bullets.forEach(([row, column]) => {
    board[row][column] = RaceCell.Block;
  });

  army.forEach(([row, column]) => {
    board[row][column] = RaceCell.Block;
  });
}

export const isCollision = ([_, column]: number[], isLeft?: boolean) => {
  const newColumn = isLeft ? column - 1 : column + 1;
  return newColumn >= 0 && newColumn < BOARD_WIDTH;
};
