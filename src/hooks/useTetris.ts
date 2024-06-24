import { useCallback, useEffect, useState } from "react";
import {
  Block,
  BlockShape,
  BoardShape,
  EmptyCell,
  SHAPES,
} from "../types/tetris";
import { useInterval } from "./useInterval";
import {
  useTetrisBoard,
  hasCollisions,
  BOARD_HEIGHT,
  getEmptyBoard,
  getRandomBlock,
} from "./useTetrisBoard";
import { ButtonIds } from "../constants";
import { useLevel } from "./useLevel";

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
  const { level, speed } = useLevel(score);

  const [
    { board, droppingRow, droppingColumn, droppingBlock, droppingShape },
    dispatchBoardState,
  ] = useTetrisBoard();

  const startGame = useCallback(() => {
    const startingBlocks = [getRandomBlock()];
    setIsFinished(false);
    setScore(0);
    setUpcomingBlocks(startingBlocks);
    setIsCommitting(false);
    setIsPlaying(true);
    setIsStart(true);
    setTickSpeed(speed);
    dispatchBoardState({ type: "start" });
  }, [dispatchBoardState, speed]);

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
      console.log("asdasdasds");
      setIsFinished(true);
      setIsPlaying(false);
      setTickSpeed(null);
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
    speed,
    dispatchBoardState,
    droppingBlock,
    droppingColumn,
    droppingRow,
    droppingShape,
    upcomingBlocks,
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
      }, 200);
    };

    const handleTouchDown = (event: TouchEvent) => {
      // @ts-ignore
      if (!event?.target || event.target.id === "paused") {
        return;
      }
      event?.preventDefault?.();

      // @ts-ignore
      if (event?.target?.id === ButtonIds.Bottom) {
        setTickSpeed(TickSpeed.Fast);
      }
      // @ts-ignore
      if (event?.target?.id === ButtonIds.Rotate) {
        dispatchBoardState({ type: "move", isRotating: true });
      }

      // @ts-ignore
      if (event?.target?.id === ButtonIds.Left) {
        isPressingLeft = true;
        updateMovementInterval();
      }

      // @ts-ignore
      if (event?.target?.id === ButtonIds.Right) {
        isPressingRight = true;
        updateMovementInterval();
      }
    };
    const handleTouchUp = (event: TouchEvent) => {
      // @ts-ignore
      if (!event?.target || event.target.id === "paused") {
        return;
      }
      //@ts-ignore
      if (event?.target?.id === ButtonIds.Bottom) {
        setTickSpeed(speed);
      }
      //@ts-ignore
      if (event?.target?.id === ButtonIds.Left) {
        isPressingLeft = false;
        updateMovementInterval();
      }

      //@ts-ignore
      if (event?.target?.id === ButtonIds.Right) {
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
