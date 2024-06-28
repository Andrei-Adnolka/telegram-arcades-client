import { useCallback, useEffect, useState } from "react";

import {
  Block,
  BlockShape,
  BoardShape,
  EmptyCell,
  SHAPES,
} from "../../../types";
import { useInterval } from "../../../hooks/useInterval";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { useTetrisBoard } from "./useTetrisBoard";
import {
  BOARD_HEIGHT,
  ButtonIds,
  COOKIES_HIGHT_SCORE_NAME,
  STORAGE_NAME,
} from "../constants";
import { useLevel } from "./useLevel";
import { useHightScore } from "../../../hooks/useHighScore";
import { getEmptyBoard, getRandomBlock, hasCollisions } from "./helpers";

enum TickSpeed {
  Sliding = 100,
  Fast = 20,
}

export function useTetris() {
  const [score, setScore] = useState(0);
  const [upcomingBlocks, setUpcomingBlocks] = useState<Block[]>([]);
  const [isCommitting, setIsCommitting] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const [tickSpeed, setTickSpeed] = useState<TickSpeed | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isContinue, setIsContinue] = useState(false);
  const { level, speed, setLevel } = useLevel(score);
  const { hightScore, onSendHightScore } = useHightScore(
    COOKIES_HIGHT_SCORE_NAME
  );

  const [
    { board, droppingRow, droppingColumn, droppingBlock, droppingShape },
    dispatchBoardState,
  ] = useTetrisBoard();

  const { getItem, setItem, removeItem } = useLocalStorage(STORAGE_NAME);

  const startGame = useCallback(() => {
    const startingBlocks = [getRandomBlock()];
    setIsFinished(false);
    setIsPause(false);
    setIsContinue(false);
    setScore(0);
    setUpcomingBlocks(startingBlocks);
    setIsCommitting(false);
    setIsPlaying(true);
    setIsStart(true);
    setTickSpeed(speed);
    dispatchBoardState({ type: "start" });
    removeItem();
  }, [dispatchBoardState, speed, removeItem]);

  const pauseGame = useCallback(() => {
    if (isStart) {
      setIsPlaying((prev) => !prev);
      setIsPause((prev) => !prev);
    }
  }, [isStart]);

  const commitPosition = useCallback(() => {
    if (!hasCollisions(board, droppingShape, droppingRow + 1, droppingColumn)) {
      setIsCommitting(false);
      setTickSpeed(speed);
      return;
    }

    const newBoard = structuredClone(board) as BoardShape;
    addShapeToBoard(
      newBoard,
      droppingBlock,
      droppingShape,
      droppingRow,
      droppingColumn
    );

    let numCleared = 0;
    for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
      if (newBoard[row].every((entry) => entry !== EmptyCell.Empty)) {
        numCleared++;
        newBoard.splice(row, 1);
      }
    }

    const newUpcomingBlocks = structuredClone(upcomingBlocks) as Block[];
    const newBlock = newUpcomingBlocks.pop() as Block;
    newUpcomingBlocks.unshift(getRandomBlock());

    if (hasCollisions(board, SHAPES[newBlock].shape, 0, 3)) {
      setIsFinished(true);
      setIsPlaying(false);
      setTickSpeed(null);
      onSendHightScore(score.toString());
    } else {
      setTickSpeed(speed);
    }
    setUpcomingBlocks(newUpcomingBlocks);
    setScore((prevScore) => prevScore + getPoints(numCleared));
    dispatchBoardState({
      type: "commit",
      newBoard: [...getEmptyBoard(BOARD_HEIGHT - newBoard.length), ...newBoard],
      newBlock,
    });
    setIsCommitting(false);
  }, [
    board,
    droppingShape,
    droppingRow,
    droppingColumn,
    droppingBlock,
    upcomingBlocks,
    dispatchBoardState,
    speed,
    onSendHightScore,
    score,
  ]);

  const gameTick = useCallback(() => {
    if (isCommitting) {
      commitPosition();
    } else if (
      hasCollisions(board, droppingShape, droppingRow + 1, droppingColumn)
    ) {
      setTickSpeed(TickSpeed.Sliding);
      setIsCommitting(true);
    } else {
      dispatchBoardState({ type: "drop" });
    }
  }, [
    board,
    commitPosition,
    dispatchBoardState,
    droppingColumn,
    droppingRow,
    droppingShape,
    isCommitting,
  ]);

  useInterval(() => {
    if (!isPlaying) {
      return;
    }

    gameTick();
  }, tickSpeed);

  useEffect(() => {
    window.addEventListener("load", () => {
      const data = getItem();
      if (data) {
        setIsContinue(true);
      }
    });
  }, [getItem]);

  const onContinue = useCallback(() => {
    const { score, isCommitting, upcomingBlocks, speed, ...rest } = getItem();

    setScore(score);
    setLevel(score);
    setIsCommitting(isCommitting);
    setUpcomingBlocks(upcomingBlocks);
    setTickSpeed(speed);

    setIsPause(false);
    setIsStart(true);
    setIsPlaying(true);

    dispatchBoardState({ type: "setState", ...rest });

    const newBoard = structuredClone(rest.board) as BoardShape;
    addShapeToBoard(
      newBoard,
      rest.droppingBlock,
      rest.droppingShape,
      rest.droppingRow,
      rest.droppingColumn
    );

    setIsContinue(false);
  }, [dispatchBoardState, getItem, setLevel]);

  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      setItem({
        board,
        droppingColumn,
        droppingBlock,
        droppingRow,
        droppingShape,
        isCommitting,
        score,
        speed,
        upcomingBlocks,
      });
    });
  }, [
    board,
    droppingBlock,
    droppingColumn,
    droppingRow,
    droppingShape,
    isCommitting,
    level,
    score,
    setItem,
    speed,
    upcomingBlocks,
  ]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    let isPressingLeft = false;
    let isPressingRight = false;
    let moveIntervalID: any;

    const updateMovementInterval = () => {
      clearInterval(moveIntervalID);
      dispatchBoardState({
        type: "move",
        isPressingLeft,
        isPressingRight,
      });
      moveIntervalID = setInterval(() => {
        dispatchBoardState({
          type: "move",
          isPressingLeft,
          isPressingRight,
        });
      }, 130);
    };

    const handleTouchDown = (event: TouchEvent) => {
      const id = (event.target as HTMLElement).id;
      if (!id || id === "paused") {
        return;
      }
      event?.preventDefault?.();

      if (id === ButtonIds.Bottom) {
        setTickSpeed(TickSpeed.Fast);
      }
      if (id === ButtonIds.Rotate) {
        dispatchBoardState({ type: "move", isRotating: true });
      }
      if (id === ButtonIds.Left) {
        isPressingLeft = true;
        updateMovementInterval();
      }
      if (id === ButtonIds.Right) {
        isPressingRight = true;
        updateMovementInterval();
      }
    };
    const handleTouchUp = (event: TouchEvent) => {
      const id = (event.target as HTMLElement).id;
      if (!id || id === "paused") {
        return;
      }
      if (id === ButtonIds.Bottom) {
        setTickSpeed(speed);
      }
      if (id === ButtonIds.Left) {
        isPressingLeft = false;
        updateMovementInterval();
      }
      if (id === ButtonIds.Right) {
        isPressingRight = false;
        updateMovementInterval();
      }
    };

    document.addEventListener("touchstart", handleTouchDown);
    document.addEventListener("touchend", handleTouchUp);
    return () => {
      document.removeEventListener("touchstart", handleTouchDown);
      document.removeEventListener("touchend", handleTouchUp);
      clearInterval(moveIntervalID);
      setTickSpeed(speed);
    };
  }, [dispatchBoardState, isPlaying, speed]);

  const renderedBoard = structuredClone(board) as BoardShape;

  if (isPlaying) {
    addShapeToBoard(
      renderedBoard,
      droppingBlock,
      droppingShape,
      droppingRow,
      droppingColumn
    );
  }

  return {
    board: renderedBoard,
    startGame,
    pauseGame,
    isPlaying,
    isPause,
    isFinished,
    level,
    isStart,
    score,
    upcomingBlocks,
    hightScore,
    isContinue,
    onContinue,
  };
}

function getPoints(numCleared: number): number {
  switch (numCleared) {
    case 0:
      return 0;
    case 1:
      return 100;
    case 2:
      return 300;
    case 3:
      return 500;
    case 4:
      return 800;
    default:
      throw new Error("Unexpected number of rows cleared");
  }
}

function addShapeToBoard(
  board: BoardShape,
  droppingBlock: Block,
  droppingShape: BlockShape,
  droppingRow: number,
  droppingColumn: number
) {
  droppingShape
    .filter((row) => row.some((isSet) => isSet))
    .forEach((row: boolean[], rowIndex: number) => {
      row.forEach((isSet: boolean, colIndex: number) => {
        if (isSet) {
          board[droppingRow + rowIndex][droppingColumn + colIndex] =
            droppingBlock;
        }
      });
    });
}
