import { useCallback, useEffect } from "react";
import isEqual from "lodash.isequal";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  selectBlocks,
  selectBoard,
  setBoard,
  setIsGameOver,
  setScore,
} from "../redux/gameSlice";
import { Block, BLOCK_L, BlockShape, BoardShape, EmptyCell } from "../types";
import { addShapeToBoard, getNewBlockIds, hasCollisions } from "./helpers";
import { useTelegram } from "../../../provider/telegram";

//@ts-ignore
const onIsCanDrop = (el) => !!el.classList.contains("Empty");

export const useCommitPosition = () => {
  const board = useAppSelector(selectBoard, isEqual);
  const blocks = useAppSelector(selectBlocks, isEqual);
  const { webApp } = useTelegram();

  const dispatch = useAppDispatch();

  const hasCollision = useCallback(
    (shape: BlockShape, row: number, column: number) => {
      const newBoard = structuredClone(board) as BoardShape;
      return hasCollisions(newBoard, shape, row, column);
    },
    [board]
  );

  useEffect(() => {
    const newBlocks = blocks.filter((b) => b.block !== ("empty" as Block));
    const getAllBoardCells = document.querySelectorAll(".field-cell.Empty");

    if (newBlocks.length) {
      const collisions = [] as boolean[];
      newBlocks.forEach((block) => {
        const blockL = block.shape
          .reduce((acc, next) => [...acc, ...next], [])
          .filter((b) => b);

        getAllBoardCells.forEach((cell) => {
          let isCanDrop = false;
          const [row, column] = cell.id.split("-");
          const ids = getNewBlockIds(block.shape, +row, +column).filter(
            (t) => !/[89]/.test(t)
          );
          if (!isCanDrop) {
            if (blockL.length === ids.length) {
              const isEmptyIds = [] as boolean[];
              ids.forEach((id) => {
                const isEmpty = onIsCanDrop(document.getElementById(id));
                isEmptyIds.push(isEmpty);
              });

              if (isEmptyIds.filter((a) => a).length === blockL.length) {
                collisions.push(true);
                isCanDrop = true;
              }
            }
          }
        });
      });
      if (!collisions.length) {
        dispatch(setIsGameOver());
      }
    }
  }, [blocks, dispatch]);

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
          numCleared = removedValues.length * 2;
          webApp?.HapticFeedback?.impactOccurred?.("soft");
        });

        dispatch(setBoard(b));
        dispatch(setScore(BLOCK_L[block] + numCleared));
        return true;
      }

      return false;
    },
    [board, dispatch, hasCollision, webApp]
  );

  return { hasCollision, commitPosition };
};
