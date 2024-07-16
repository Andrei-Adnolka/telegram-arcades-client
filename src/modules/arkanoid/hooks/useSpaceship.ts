import { useCallback, useEffect, useState } from "react";

import { BoardShape, DefaultShape, SpaceshipCell } from "../../../types";
import { useInterval } from "../../../hooks/useInterval";
import { ButtonIds } from "../../../constants";

import { useSpaceshipBoard } from "./useSpaceshipBoard";
import { useLevel } from "./useLevel";
import { BOARD_HEIGHT } from "./helpers";

export function useSpaceship() {
  const [isStart, setIsStart] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const [ballSpeed, setBallSpeed] = useState<number>(0);
  const [isBallStarted, setIsBallStarted] = useState(false);

  const [
    { board, spaceship, bricks, score, isGameOver: isGM, ball },
    dispatchBoardState,
  ] = useSpaceshipBoard();
  const { level, speed } = useLevel(score);

  const startGame = useCallback(() => {
    setIsBallStarted(false);
    setIsGameOver(false);
    setIsPause(false);
    setIsPlaying(true);
    setIsStart(true);
    setBallSpeed(speed);
    dispatchBoardState({ type: "start" });
  }, [dispatchBoardState, speed]);

  const pauseGame = useCallback(() => {
    if (isStart) {
      setIsPlaying((prev) => !prev);
      setIsPause((prev) => !prev);
    }
  }, [isStart]);

  const gameTick = useCallback(() => {
    if (isBallStarted) {
      if (ball[0] === BOARD_HEIGHT) {
        setIsGameOver(true);
        setIsPlaying(false);
        return;
      }
      dispatchBoardState({ type: "ballMove" });
    }
  }, [ball, dispatchBoardState, isBallStarted]);

  useEffect(() => {
    if (isGM) {
      setIsGameOver(true);
      setIsPlaying(false);
    }
  }, [isGM]);

  useInterval(() => {
    if (isPlaying) {
      gameTick();
      return;
    }
  }, ballSpeed);

  const handleTouchDown = useCallback(
    (id: ButtonIds, isTouchStart?: boolean) => {
      if (!isPlaying) {
        return;
      }
      if (id === ButtonIds.Left) {
        dispatchBoardState({ type: "shipMove", isLeft: true, isBallStarted });
      }
      if (id === ButtonIds.Right) {
        dispatchBoardState({ type: "shipMove", isLeft: false, isBallStarted });
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
    addShapeToBoard(renderedBoard, spaceship, ball, bricks);
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
    onContinue: () => {},
    hightScore: 0,
    isContinue: false,
  };
}

function addShapeToBoard(
  board: BoardShape,
  spaceship: DefaultShape,
  ball: number[],
  bricks: DefaultShape
) {
  spaceship.forEach(([row, column]) => {
    board[row][column] = SpaceshipCell.Spaceship;
  });
  bricks.forEach(([row, column]) => {
    board[row][column] = SpaceshipCell.Spaceship;
  });

  if (ball) {
    board[ball[0]][ball[1]] = SpaceshipCell.Ball;
  }
}
