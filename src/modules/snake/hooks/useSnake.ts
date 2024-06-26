import { useCallback, useEffect, useState } from "react";

import { SnakeShape, BoardShape, SnakeCell } from "../../../types";
import { useInterval } from "../../../hooks/useInterval";
import {
  ButtonIds,
  COOKIES_HIGHT_SCORE_NAME,
  STORAGE_NAME,
} from "../../../constants";

import { useSnakeBoard } from "./useSnakeBoard";
import { isEating, hasCollisions, isEatingHerself, LEVELS } from "./helpers";
import { useHightScore } from "../../../hooks/useHighScore";
import { useLevel } from "../../../hooks/useLevel";
import { useLocalStorage } from "../../../hooks/useLocalStorage";

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
  const [isStart, setIsStart] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const [snakeSpeed, setSnakeSpeed] = useState<number>(0);
  const [direction, setDirection] = useState("right");
  const [isContinue, setIsContinue] = useState(false);

  const { hightScore, onSendHightScore } = useHightScore(
    COOKIES_HIGHT_SCORE_NAME
  );
  const { level, speed, setLevel } = useLevel(score, LEVELS);
  const { getItem, setItem, removeItem } = useLocalStorage(STORAGE_NAME);

  useEffect(() => {
    const data = getItem();
    if (data) {
      setIsContinue(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [
    { board, snakesHeadColumn, snakesHeadRow, snake },
    dispatchBoardState,
  ] = useSnakeBoard();

  const onContinue = useCallback(() => {
    const { score, speed, ...rest } = getItem();

    setScore(score);
    setLevel(score);
    setSnakeSpeed(speed);

    setIsPause(false);
    setIsStart(true);
    setIsPlaying(true);

    dispatchBoardState({ type: "setState", ...rest });

    const newBoard = structuredClone(rest.board) as BoardShape;
    addShapeToBoard(newBoard, rest.snake);

    setIsContinue(false);
    removeItem();
  }, [dispatchBoardState, getItem, removeItem, setLevel]);

  const startGame = useCallback(() => {
    setIsGameOver(false);
    setIsPause(false);
    setScore(0);
    setIsPlaying(true);
    setIsStart(true);
    setSnakeSpeed(speed);
    setDirection("right");
    dispatchBoardState({ type: "start" });
    removeItem();
    setIsContinue(false);
  }, [dispatchBoardState, removeItem, speed]);

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

    if (
      hasCollisions(board, newRow, newColumn) ||
      isEatingHerself(snake, newRow, newColumn)
    ) {
      setIsGameOver(true);
      setIsPlaying(false);
      onSendHightScore(score);
      return;
    }

    if (isEating(board, newRow, newColumn)) {
      const newSnake = structuredClone(snake);
      newSnake.push([newRow, newColumn]);
      const newBoard = structuredClone(board) as BoardShape;
      addShapeToBoard(newBoard, newSnake);
      setScore((prev) => prev + 100);

      dispatchBoardState({ type: "eat", snake: newSnake });
    } else {
      dispatchBoardState({ type: "move", ...getDirection(direction) });
    }
    setItem({ board, score, speed, direction, snake });
  }, [
    direction,
    snakesHeadRow,
    snakesHeadColumn,
    board,
    snake,
    setItem,
    score,
    speed,
    onSendHightScore,
    dispatchBoardState,
  ]);

  useInterval(() => {
    if (!isPlaying) {
      return;
    }
    gameTick();
  }, snakeSpeed);

  const handleTouchDown = useCallback(
    (id: ButtonIds, isTouchStart?: boolean) => {
      if (!isPlaying) {
        return;
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
      if (id === ButtonIds.Rotate) {
        setSnakeSpeed(isTouchStart ? speed / 2 : speed);
      }
    },
    [direction, isPlaying, speed]
  );

  const renderedBoard = structuredClone(board) as BoardShape;

  if (isPlaying) {
    addShapeToBoard(renderedBoard, snake);
  }

  return {
    board: renderedBoard,
    handleTouchDown,
    startGame,
    pauseGame,
    isPlaying,
    isPause,
    level,
    isStart,
    isGameOver,
    score,
    speed,
    hightScore,
    isContinue,
    onContinue,
  };
}

function addShapeToBoard(board: BoardShape, snake: SnakeShape) {
  snake.forEach(([row, column]) => {
    board[row][column] = SnakeCell.Snake;
  });
}
