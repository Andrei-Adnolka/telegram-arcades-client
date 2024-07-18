import { useCallback, useEffect, useState } from "react";

import { BoardShape } from "../../../types";
import { useInterval } from "../../../hooks/useInterval";
import { ButtonIds } from "../../../constants";

import { useSpaceshipBoard } from "./useSpaceshipBoard";
import { BOARD_HEIGHT, addShapeToBoard } from "./helpers";
import { useHightScore } from "../../../hooks/useHighScore";
import { COOKIES_HIGHT_SCORE_NAME } from "./constants";

export function useSpaceship() {
  const [isStart, setIsStart] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const [speed, setSpeed] = useState<number>(0);
  const [isLeftFire, setIsLeftFire] = useState<boolean | null>(null);

  const [
    {
      board,
      spaceship,
      bricks,
      score,
      isBallStarted,
      isGameOver: isGM,
      ball,
      lives,
      levelData,
      isLeftFire: isLeftFireStore,
    },
    dispatchBoardState,
  ] = useSpaceshipBoard();

  const { hightScore, onSendHightScore } = useHightScore(
    COOKIES_HIGHT_SCORE_NAME
  );

  const startGame = useCallback(() => {
    setIsGameOver(false);
    setIsPause(false);
    setIsPlaying(true);
    setIsStart(true);
    setSpeed(levelData.speed);
    dispatchBoardState({ type: "start" });
  }, [dispatchBoardState, levelData.speed]);

  const pauseGame = useCallback(() => {
    if (isStart) {
      setIsPlaying((prev) => !prev);
      setIsPause((prev) => !prev);
    }
  }, [isStart]);

  const gameTick = useCallback(() => {
    if (ball[0] === BOARD_HEIGHT) {
      setIsGameOver(true);
      setIsPlaying(false);
      return;
    }
    dispatchBoardState({ type: "ballMove" });
  }, [ball, dispatchBoardState, isBallStarted]);

  useEffect(() => {
    if (isLeftFireStore !== null) {
      setIsLeftFire(isLeftFireStore);
      setTimeout(() => {
        setIsLeftFire(null);
        dispatchBoardState({ type: "setIsLeftFire" });
      }, 2000);
    }
  }, [isLeftFireStore]);

  useEffect(() => {
    setSpeed(levelData.speed);
  }, [levelData.speed]);

  useEffect(() => {
    if (isGM) {
      setIsGameOver(true);
      setIsPlaying(false);
      onSendHightScore(score);
    }
  }, [isGM, score]);

  useInterval(() => {
    if (isPlaying && isBallStarted && isLeftFire === null) {
      gameTick();
      return;
    }
  }, speed);

  const handleTouchDown = useCallback(
    (id: ButtonIds, isTouchStart?: boolean) => {
      if (!isPlaying || isLeftFire !== null) {
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
          dispatchBoardState({ type: "startBall" });
        } else {
          setSpeed(isTouchStart ? levelData.speed / 3 : levelData.speed);
        }
      }
    },
    [dispatchBoardState, isBallStarted, isPlaying, levelData.speed, isLeftFire]
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
    level: levelData.level,
    isLeftFire,
    isStart,
    isGameOver,
    score,
    speed,
    onContinue: () => {},
    hightScore,
    isContinue: false,
    lives,
  };
}
