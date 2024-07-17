import { BoardShape, EmptyCell } from "../../../../types";

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 17;

export function getEmptyBoard(height = BOARD_HEIGHT): BoardShape {
  return Array(height)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(EmptyCell.Empty));
}

export const getNewBallPosition = (
  ball: number[],
  top: number,
  right: number
) => {
  let newRow = ball[0] + top;
  let newColumn = ball[1] + right;

  if (newRow < 0) {
    newRow = 1;
  }
  if (newColumn < 0) {
    newColumn = 0;
  }
  if (newColumn > 9) {
    newColumn = 9;
  }

  return [newRow, newColumn];
};

export const getTouchBricks = (
  ball: number[],
  bricks: number[][],
  newBallTop: number,
  newBallRight: number
) => {
  const newBricks = [...bricks];
  let score = 0;

  let isTouchRowBricks = false;
  let isTouchColumnBricks = false;

  const ballRow = ball[0];
  const ballColumn = ball[1];
  const data = getNewBallPosition(ball, newBallTop, newBallRight);
  const [newRow, newColumn] = data;

  newBricks.forEach((el, i) => {
    const brickRow = el[0];
    const brickColumn = el[1];

    const checkColumns = (element: number) =>
      brickRow === ballRow && brickColumn === ballColumn + element;

    const checkRows = (elements: number) =>
      brickRow === ballRow + elements && brickColumn === ballColumn;

    const updatedBricks = (index: number) => {
      newBricks.splice(index, 1);
      score += +10;
    };

    if (!isTouchColumnBricks && (checkColumns(-1) || checkColumns(1))) {
      updatedBricks(i);
      isTouchColumnBricks = true;
    } else if (!isTouchRowBricks && (checkRows(-1) || checkRows(1))) {
      updatedBricks(i);
      isTouchRowBricks = true;
    }
    if (
      !isTouchRowBricks &&
      !isTouchColumnBricks &&
      brickRow === newRow &&
      brickColumn === newColumn
    ) {
      updatedBricks(i);
      isTouchRowBricks = true;
      isTouchColumnBricks = true;
    }
  });

  return { isTouchRowBricks, isTouchColumnBricks, newBricks, score };
};
