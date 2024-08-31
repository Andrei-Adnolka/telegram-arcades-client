import { Block, BlockShape, BoardShape, EmptyCell, SHAPES } from "../../types";

import { BOARD_HEIGHT, BOARD_WIDTH } from "../../constants";

export function getEmptyBoard(height = BOARD_HEIGHT): BoardShape {
  return Array(height)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(EmptyCell.Empty));
}
const getShape = (block: Block) => {
  return SHAPES[block].shape.filter((row) => row.some((cell) => cell));
};

export function getRandomBlock() {
  const blockValues = Object.values(Block);
  const block = blockValues[
    Math.floor(Math.random() * blockValues.length)
  ] as Block;

  return { block, shape: getShape(block) };
}

export function rotateBlock(shape: BlockShape): BlockShape {
  const rows = shape.length;
  const columns = shape[0].length;

  const rotated = Array(rows)
    .fill(null)
    .map(() => Array(columns).fill(false));

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      rotated[column][rows - 1 - row] = shape[row][column];
    }
  }

  return rotated;
}

export function addShapeToBoard(
  board: BoardShape,
  droppingBlock: Block,
  droppingShape: BlockShape,
  droppingRow: number,
  droppingColumn: number
) {
  const b = [...board];
  droppingShape
    .filter((row) => row.some((isSet) => isSet))
    .forEach((row: boolean[], rowIndex: number) => {
      row.forEach((isSet: boolean, colIndex: number) => {
        if (isSet) {
          b[droppingRow + rowIndex][droppingColumn + colIndex] = droppingBlock;
        }
      });
    });
  return b;
}

export function getNewBlockIds(
  droppingShape: BlockShape,
  droppingRow: number,
  droppingColumn: number
) {
  const ids = [] as string[];
  droppingShape
    .filter((row) => row.some((isSet) => isSet))
    .forEach((row: boolean[], rowIndex: number) => {
      row.forEach((isSet: boolean, colIndex: number) => {
        if (isSet) {
          const newRow = droppingRow + rowIndex;
          const newColumn = droppingColumn + colIndex;
          ids.push(`${newRow}-${newColumn}`);
        }
      });
    });

  return ids;
}

export function hasCollisions(
  board: BoardShape,
  currentShape: BlockShape,
  row: number,
  column: number
): boolean {
  let hasCollision = false;
  currentShape
    .filter((shapeRow) => shapeRow.some((isSet) => isSet))
    .forEach((shapeRow: boolean[], rowIndex: number) => {
      shapeRow.forEach((isSet: boolean, colIndex: number) => {
        if (
          isSet &&
          (row + rowIndex >= board.length ||
            column + colIndex >= board[0].length ||
            column + colIndex < 0 ||
            board[row + rowIndex][column + colIndex] !== EmptyCell.Empty)
        ) {
          hasCollision = true;
        }
      });
    });
  return hasCollision;
}
