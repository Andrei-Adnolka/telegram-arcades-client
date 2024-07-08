import { useCallback, useEffect, useState } from "react";

import { BoardShape } from "../../../types";
import { useInterval } from "../../../hooks/useInterval";
import { useHightScore } from "../../../hooks/useHighScore";
import { useLevel } from "../../../hooks/useLevel";
import { ButtonIds } from "../../../constants";

import { COOKIES_HIGHT_SCORE_NAME, LEVELS } from "../constants";

import { useRaceBoard } from "./useRaceBoard";
import { addShapeToBoard } from "./helpers";

export function useRace() {
  const [isStart, setIsStart] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const [carSpeed, setCarSpeed] = useState(0);

  const [
    {
      board,
      car,
      score,
      isCrash,
      crashBlock,
      otherCars,
      leftBoard,
      rightBoard,
    },
    dispatchBoardState,
  ] = useRaceBoard();

  const { level, speed } = useLevel(score, LEVELS);

  const { hightScore, onSendHightScore } = useHightScore(
    COOKIES_HIGHT_SCORE_NAME
  );

  const startGame = useCallback(() => {
    setIsGameOver(false);
    setIsPause(false);
    setIsPlaying(true);
    setIsStart(true);
    setCarSpeed(speed);
    dispatchBoardState({ type: "start" });
  }, [dispatchBoardState, speed]);

  const pauseGame = useCallback(() => {
    if (isStart) {
      setIsPlaying((prev) => !prev);
      setIsPause((prev) => !prev);
    }
  }, [isStart]);

  const gameTick = useCallback(() => {
    dispatchBoardState({ type: "boardsMove" });
    dispatchBoardState({ type: "otherCarsMove" });
  }, [dispatchBoardState]);

  const stopGame = !isPlaying || isCrash;

  useEffect(() => {
    setCarSpeed(speed);
  }, [speed]);

  useEffect(() => {
    if (isCrash) {
      setTimeout(() => {
        setIsPlaying(false);
        setIsGameOver(true);
        onSendHightScore(score);
      }, 1000);
    }
  }, [isCrash, score, onSendHightScore]);

  useInterval(() => {
    if (stopGame) return;

    gameTick();
  }, carSpeed);

  useInterval(() => {
    if (stopGame) return;

    dispatchBoardState({ type: "createCar" });
  }, carSpeed * 8);

  const handleTouchDown = useCallback(
    (id: ButtonIds, isTouchStart?: boolean) => {
      if (stopGame) return;
      if (id === ButtonIds.Left) {
        dispatchBoardState({ type: "carMove", isLeft: true });
      }
      if (id === ButtonIds.Right) {
        dispatchBoardState({ type: "carMove", isLeft: false });
      }
      if (id === ButtonIds.Rotate) {
        setCarSpeed(isTouchStart ? speed / 2 : speed);
      }
    },
    [dispatchBoardState, speed, stopGame]
  );

  const renderedBoard = structuredClone(board) as BoardShape;

  if (isPlaying) {
    addShapeToBoard(
      renderedBoard,
      car,
      otherCars,
      leftBoard,
      rightBoard,
      crashBlock
    );
  }

  return {
    board: renderedBoard,
    handleTouchDown,
    startGame,
    pauseGame,
    onContinue: () => {},
    isContinue: false,
    hightScore,
    isPlaying,
    isPause,
    level,
    isStart,
    isGameOver,
    score,
    speed,
  };
}
