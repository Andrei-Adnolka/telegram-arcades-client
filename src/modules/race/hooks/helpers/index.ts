import { BoardShape, EmptyCell } from "../../../../types";

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
