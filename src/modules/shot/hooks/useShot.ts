import { useCallback, useEffect, useState } from "react";

import { BoardShape } from "../../../types";
import { useInterval } from "../../../hooks/useInterval";
import { useHightScore } from "../../../hooks/useHighScore";
import { useLevel } from "../../../hooks/useLevel";
import { ButtonIds } from "../../../constants";

import { COOKIES_HIGHT_SCORE_NAME, LEVELS } from "../constants";

import { useShotBoard } from "./useShotBoard";
import { addShapeToBoard } from "./helpers";

export function useShot() {
  const [isStart, setIsStart] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [carSpeed, setCarSpeed] = useState(0);

  const [{ board, space, bullets, army, score }, dispatchBoardState] =
    useShotBoard();

  const { level, speed } = useLevel(score, LEVELS);

  const { hightScore, onSendHightScore } = useHightScore(
    COOKIES_HIGHT_SCORE_NAME
  );

  const startGame = useCallback(() => {
    setIsPause(false);
    setIsGameOver(false);
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

  const stopGame = !isPlaying || isGameOver;

  useEffect(() => {
    setCarSpeed(speed);
  }, [speed]);

  const gameTick = useCallback(() => {
    if (army[0][0] === 15) {
      setIsGameOver(true);
      setIsPlaying(false);
      onSendHightScore(score);
      return;
    }
    dispatchBoardState({ type: "armyMove" });
  }, [army, score, onSendHightScore, dispatchBoardState]);

  useInterval(() => {
    if (stopGame) return;
    gameTick();
  }, carSpeed);

  useInterval(() => {
    if (stopGame) return;

    if (bullets.length) {
      dispatchBoardState({ type: "bulletsMove", bullets });
    }
  }, carSpeed / 6);

  const handleTouchDown = useCallback(
    (id: ButtonIds, isTouchStart?: boolean) => {
      if (stopGame) return;
      if (id === ButtonIds.Left) {
        dispatchBoardState({ type: "spaceMove", isLeft: true });
      }
      if (id === ButtonIds.Right) {
        dispatchBoardState({ type: "spaceMove", isLeft: false });
      }
      if (id === ButtonIds.Rotate) {
        if (isTouchStart) {
          dispatchBoardState({ type: "spaceFire" });
        }
      }
    },
    [dispatchBoardState, stopGame]
  );

  const renderedBoard = structuredClone(board) as BoardShape;

  if (isPlaying) {
    addShapeToBoard(renderedBoard, space, bullets, army);
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
