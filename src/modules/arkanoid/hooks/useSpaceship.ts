import { useCallback, useState } from "react";

import { BoardShape, SpaceshipCell, SpaceshipShape } from "../../../types";
import { useInterval } from "../../../hooks/useInterval";
import { ButtonIds } from "../../../constants";

import { useSpaceshipBoard } from "./useSpaceshipBoard";
import { useLevel } from "./useLevel";
import { BOARD_HEIGHT, BOARD_WIDTH } from "./helpers";

enum Directions {
  RightTop = "right_top",
  RightBottom = "right_bottom",
  LeftTop = "left_top",
  LeftBottom = "left_bottom",
}

const getDirection = (direction: Directions) => {
  switch (direction) {
    case Directions.RightTop: {
      return { column: 1, row: -1 };
    }
    case Directions.RightBottom: {
      return { column: 1, row: 1 };
    }
    case Directions.LeftTop: {
      return { column: -1, row: -1 };
    }
    case Directions.LeftBottom: {
      return { column: -1, row: 1 };
    }
    default: {
      return { row: 0, column: 0 };
    }
  }
};

export function useSpaceship() {
  const [score, setScore] = useState(0);
  const [isStart, setIsStart] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const [ballSpeed, setBallSpeed] = useState<number>(0);
  const [isBallStarted, setIsBallStarted] = useState(false);
  const [ballDirection, setBallDirection] = useState(Directions.LeftTop);

  const { level, speed } = useLevel(score);

  const [{ board, spaceship, ball }, dispatchBoardState] = useSpaceshipBoard();

  const startGame = useCallback(() => {
    setIsBallStarted(false);
    setIsGameOver(false);
    setIsPause(false);
    setScore(0);
    setIsPlaying(true);
    setIsStart(true);
    setBallSpeed(speed);
    dispatchBoardState({ type: "start" });
    setBallDirection(Directions.RightTop);
  }, [dispatchBoardState, speed]);

  const pauseGame = useCallback(() => {
    if (isStart) {
      setIsPlaying((prev) => !prev);
      setIsPause((prev) => !prev);
    }
  }, [isStart]);

  const gameTick = useCallback(() => {
    if (isBallStarted) {
      let row = ball[0];
      let column = ball[1];

      let direction = getDirection(ballDirection);

      let newRow = row + direction.row;
      let newColumn = column + direction.column;

      if (newRow === BOARD_HEIGHT) {
        setIsGameOver(true);
        setIsPlaying(false);
        return;
      }

      let newDirection = ballDirection;

      if (newColumn === BOARD_WIDTH) {
        if (ballDirection === Directions.RightBottom) {
          newDirection = Directions.LeftBottom;
        } else {
          newDirection = Directions.LeftTop;
        }
      }

      if (newColumn === 0) {
        if (ballDirection === Directions.LeftBottom) {
          newDirection = Directions.RightBottom;
        } else {
          newDirection = Directions.RightTop;
        }
      }

      if (newRow === 0) {
        if (ballDirection === Directions.RightTop) {
          newDirection = Directions.RightBottom;
        }
        if (ballDirection === Directions.LeftTop) {
          newDirection = Directions.LeftBottom;
        }
      }

      if (newDirection) {
        setBallDirection(newDirection);
        direction = getDirection(newDirection);
      }

      newRow = row + direction.row;
      newColumn = column + direction.column;
      const newBoard = structuredClone(board) as BoardShape;
      addShapeToBoard(newBoard, spaceship, [newRow, newColumn]);

      dispatchBoardState({ type: "ballMove", row: newRow, column: newColumn });
    }
  }, [
    ball,
    ballDirection,
    board,
    dispatchBoardState,
    isBallStarted,
    spaceship,
  ]);

  useInterval(() => {
    if (!isPlaying) {
      return;
    }
    gameTick();
  }, ballSpeed);

  const handleTouchDown = useCallback(
    (id: ButtonIds, isTouchStart?: boolean) => {
      if (!isPlaying) {
        return;
      }
      if (id === ButtonIds.Left) {
        dispatchBoardState({ type: "shipMove", column: -1, isLast: true });
      }
      if (id === ButtonIds.Right) {
        dispatchBoardState({ type: "shipMove", column: 1, isLast: false });
      }
      if (id === ButtonIds.Rotate) {
        if (!isBallStarted) {
          setIsBallStarted(true);
        } else {
          setBallSpeed(isTouchStart ? speed / 2 : speed);
        }
      }
    },
    [dispatchBoardState, isBallStarted, isPlaying, speed]
  );

  const renderedBoard = structuredClone(board) as BoardShape;

  if (isPlaying) {
    addShapeToBoard(renderedBoard, spaceship, ball);
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
  };
}

function addShapeToBoard(
  board: BoardShape,
  spaceship: SpaceshipShape,
  ball: number[]
) {
  spaceship.forEach(([row, column]) => {
    board[row][column] = SpaceshipCell.Spaceship;
  });

  if (ball) {
    board[ball[0]][ball[1]] = SpaceshipCell.Ball;
  }
}
