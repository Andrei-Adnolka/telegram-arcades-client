import { useCallback } from "react";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectBoard, setBoard, setScore } from "../redux/gameSlice";
import { Block, BLOCK_L, BlockShape, BoardShape, EmptyCell } from "../types";
import { addShapeToBoard, hasCollisions } from "./helpers";
import { BOARD_HEIGHT, BOARD_WIDTH } from "../constants";

export const useCommitPosition = () => {
  const board = useAppSelector(selectBoard);
  const dispatch = useAppDispatch();

  const hasCollision = useCallback(
    (shape: BlockShape, row: number, column: number) => {
      const newBoard = structuredClone(board) as BoardShape;
      return hasCollisions(newBoard, shape, row, column);
    },
    [board]
  );

  const commitPosition = useCallback(
    (block: Block, shape: BlockShape, row: number, column: number) => {
      const newBoard = structuredClone(board) as BoardShape;
      const isHasCollision = hasCollision(shape, row, column);

      if (!isHasCollision) {
        const b = addShapeToBoard(newBoard, block, shape, row, column);
        let numCleared = 0;
        let rowsArr = {
          0: [],
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
          6: [],
          7: [],
        };
        let columnsArr = {
          0: [],
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
          6: [],
          7: [],
        };

        b.forEach((row, i) => {
          row.forEach((column, index) => {
            if (column !== "Empty") {
              // @ts-ignore
              rowsArr[i].push(column);
              // @ts-ignore
              columnsArr[index].push(column);
            }
          });
        });

        let rowsRemoved = [] as any[];
        let columnsRemoved = [] as any[];

        Object.keys(rowsArr).forEach((row) => {
          // @ts-ignore
          if (rowsArr[row].length === 8) {
            // @ts-ignore
            rowsArr[row].forEach((a: _, i) => {
              // @ts-ignore
              rowsRemoved.push(`${row}_${i}`);
            });
          }
        });
        Object.keys(columnsArr).forEach((ar) => {
          // @ts-ignore
          if (columnsArr[ar].length === 8) {
            // @ts-ignore
            columnsArr[ar].forEach((a: _, i) => {
              // @ts-ignore
              columnsRemoved.push(`${i}_${ar}`);
            });
          }
          const removedValues = Array.from(
            new Set([...rowsRemoved, ...columnsRemoved])
          );
          if (removedValues.length) {
            removedValues.forEach((values) => {
              const [row, column] = values.split("_");
              b[row][column] = EmptyCell.Empty;
            });
          }
          console.log("b", b);
        });

        dispatch(setBoard(b));
        dispatch(setScore(BLOCK_L[block] + numCleared));
        return true;
      }

      return false;
    },
    [board]
  );

  return { hasCollision, commitPosition };
};
