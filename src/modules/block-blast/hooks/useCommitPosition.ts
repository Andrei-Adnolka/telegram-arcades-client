import { useCallback } from "react";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectBoard, setBoard, setScore } from "../redux/gameSlice";
import { Block, BLOCK_L, BlockShape } from "../types";
import { addShapeToBoard, hasCollisions } from "./helpers";
import { BoardShape, EmptyCell } from "../../../types";
import { BOARD_HEIGHT } from "../constants";

export const useCommitPosition = () => {
  const board = useAppSelector(selectBoard);
  const dispatch = useAppDispatch();

  const hasCollision = useCallback(
    (shape: BlockShape, row: number, column: number) => {
      const newBoard = structuredClone(board) as BoardShape;

      return hasCollisions(newBoard, shape, row, column);

      // let numCleared = 0;
      // for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
      //   if (newBoard[row].every((entry) => entry !== EmptyCell.Empty)) {
      //     numCleared++;
      //     newBoard.splice(row, 1);
      //   }
      // }

      // const newUpcomingBlocks = structuredClone(upcomingBlocks) as Block[];
      // const newBlock = newUpcomingBlocks.pop() as Block;
      // newUpcomingBlocks.unshift(getRandomBlock());

      // if (hasCollisions(board, SHAPES[newBlock].shape, 0, 3)) {
      //   setIsGameOver(true);
      //   setIsPlaying(false);
      //   setTickSpeed(null);
      //   onSendHightScore(score);
      // } else {
      //   setTickSpeed(speed);
      // }
      // setUpcomingBlocks(newUpcomingBlocks);
      // setScore((prevScore) => prevScore + getPoints(numCleared));
      dispatch(setBoard(newBoard));
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
        for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
          if (b[row].every((entry) => entry !== EmptyCell.Empty)) {
            numCleared++;
            b.splice(row, 1);
          }
        }

        dispatch(setBoard(b));
        dispatch(setScore(BLOCK_L[block] + numCleared));
        return true;
      }

      return false;

      // let numCleared = 0;
      // for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
      //   if (newBoard[row].every((entry) => entry !== EmptyCell.Empty)) {
      //     numCleared++;
      //     newBoard.splice(row, 1);
      //   }
      // }

      // const newUpcomingBlocks = structuredClone(upcomingBlocks) as Block[];
      // const newBlock = newUpcomingBlocks.pop() as Block;
      // newUpcomingBlocks.unshift(getRandomBlock());

      // if (hasCollisions(board, SHAPES[newBlock].shape, 0, 3)) {
      //   setIsGameOver(true);
      //   setIsPlaying(false);
      //   setTickSpeed(null);
      //   onSendHightScore(score);
      // } else {
      //   setTickSpeed(speed);
      // }
      // setUpcomingBlocks(newUpcomingBlocks);
      // setScore((prevScore) => prevScore + getPoints(numCleared));
      dispatch(setBoard(newBoard));
    },
    [board]
  );

  return { hasCollision, commitPosition };
};
