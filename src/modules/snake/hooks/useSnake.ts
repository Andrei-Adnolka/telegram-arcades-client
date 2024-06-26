import { useCallback, useEffect, useState } from "react";
import { SnapeShape, BoardShape, SnakeCell, FoodCell } from "../../../types";
import { useInterval } from "../../../hooks/useInterval";
import {
  useSnakeBoard,
  hasCollisions,
  BOARD_HEIGHT,
  getEmptyBoard,
  getRandomFood,
  eating,
} from "./useSnakeBoard";
import { useLevel } from "./useLevel";
import { ButtonIds } from "../../../constants";
// import { ButtonIds } from "../constants";
// import { useLevel } from "./useLevel";

enum TickSpeed {
  Sliding = 100,
  Fast = 20,
}
const getDirection = (direction: string) => {
  switch (direction) {
    case "right": {
      return { column: 1 };
    }
    case "left": {
      return { column: -1 };
    }
    case "top": {
      return { row: -1 };
    }
    case "bottom": {
      return { row: 1 };
    }
    default: {
      return { row: 0, column: 0 };
    }
  }
};

export function useSnake() {
  const [score, setScore] = useState(0);
  const [isEating, setIsEating] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const [tickSpeed, setTickSpeed] = useState<TickSpeed | null>(null);
  const [direction, setDirection] = useState("right");

  const { level, speed } = useLevel(score);

  const [
    { board, snakesHeadColumn, snakesHeadRow, snake, food },
    dispatchBoardState,
  ] = useSnakeBoard();

  const startGame = useCallback(() => {
    setIsGameOver(false);
    setIsPause(false);
    setScore(0);
    setIsEating(false);
    setIsPlaying(true);
    setIsStart(true);
    setTickSpeed(speed);
    setDirection("right");
    dispatchBoardState({ type: "start" });
  }, [dispatchBoardState, speed]);

  const pauseGame = useCallback(() => {
    if (isStart) {
      setIsPlaying((prev) => !prev);
      setIsPause((prev) => !prev);
    }
  }, [isStart]);

  const gameTick = useCallback(() => {
    const { column = 0, row = 0 } = getDirection(direction);
    const newRow = snakesHeadRow + row;
    const newColumn = snakesHeadColumn + column;

    if (hasCollisions(board, newRow, newColumn)) {
      setIsGameOver(true);
      setIsPlaying(false);
      return;
    }

    if (eating(board, newRow, newColumn)) {
      const newSnake = structuredClone(snake);
      newSnake.push([newRow, newColumn]);
      const newBoard = structuredClone(board) as BoardShape;
      addShapeToBoard(newBoard, newSnake);
      setScore((prev) => prev + 100);

      dispatchBoardState({ type: "eat", snake: newSnake });
    } else {
      dispatchBoardState({ type: "move", ...getDirection(direction) });
    }
  }, [
    direction,
    snakesHeadRow,
    snakesHeadColumn,
    board,
    dispatchBoardState,
    snake,
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

    const handleTouchDown = (event: TouchEvent) => {
      const id = (event.target as HTMLElement).id;
      if (!id || id === "paused") {
        return;
      }
      event?.preventDefault?.();

      if (id === ButtonIds.Rotate) {
        setTickSpeed(speed);
      }
      if (id === ButtonIds.Top && direction !== "bottom") {
        setDirection("top");
      }
      if (id === ButtonIds.Bottom && direction !== "top") {
        setDirection("bottom");
      }
      if (id === ButtonIds.Left && direction !== "right") {
        setDirection("left");
      }
      if (id === ButtonIds.Right && direction !== "left") {
        setDirection("right");
      }
    };

    document.addEventListener("touchstart", handleTouchDown);
    return () => {
      document.removeEventListener("touchstart", handleTouchDown);
    };
  }, [direction, dispatchBoardState, isPlaying, speed]);

  const renderedBoard = structuredClone(board) as BoardShape;

  if (isPlaying) {
    addShapeToBoard(renderedBoard, snake);
  }

  return {
    board: renderedBoard,
    startGame,
    pauseGame,
    isPlaying,
    isPause,
    level,
    isStart,
    isGameOver,
    score,
    speed,
  };
}

function addShapeToBoard(board: BoardShape, snake: SnapeShape) {
  snake.forEach(([row, column]) => {
    board[row][column] = SnakeCell.Snake;
  });
}
