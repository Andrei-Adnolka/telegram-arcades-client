import { useCallback, useEffect, useState } from "react";

import { BoardShape, RaceCell, DefaultShape } from "../../../types";
import { useInterval } from "../../../hooks/useInterval";
import { useHightScore } from "../../../hooks/useHighScore";
import { ButtonIds } from "../../../constants";

import { useRaceBoard } from "./useRaceBoard";
import { useLevel } from "./useLevel";
import { COOKIES_HIGHT_SCORE_NAME } from "../constants";

export function useRace() {
  const [isStart, setIsStart] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const [carSpeed, setCarSpeed] = useState<number>(0);
  const [isBallStarted, setIsBallStarted] = useState(false);

  const [
    {
      board,
      car,
      score,
      isCrash,
      crashBlock,
      otherCars = [],
      leftBoard,
      rightBoard,
    },
    dispatchBoardState,
  ] = useRaceBoard();

  const { level, speed } = useLevel(score);

  const { hightScore, onSendHightScore } = useHightScore(
    COOKIES_HIGHT_SCORE_NAME
  );

  const startGame = useCallback(() => {
    setIsBallStarted(false);
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
        if (!isBallStarted) {
          setIsBallStarted(true);
        } else {
          setCarSpeed(isTouchStart ? speed / 3 : speed);
        }
      }
    },
    [dispatchBoardState, isBallStarted, speed, stopGame]
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

function getCrashBlock() {
  return [RaceCell.CrashEmpty, RaceCell.CrashFire][
    Math.floor(Math.random() * 2)
  ];
}

function addShapeToBoard(
  board: BoardShape,
  car: DefaultShape,
  otherCars: number[][][],
  leftBoard: DefaultShape,
  rightBoard: DefaultShape,
  crashBlock: DefaultShape
) {
  (otherCars || []).forEach((car) => {
    car.forEach(([row, column]) => {
      board[row][column] = RaceCell.Block;
    });
  });
  rightBoard.forEach(([row, column]) => {
    board[row][column] = RaceCell.Block;
  });
  leftBoard.forEach(([row, column]) => {
    board[row][column] = RaceCell.Block;
  });
  if (crashBlock.length) {
    crashBlock.forEach(([row, column]) => {
      board[row][column] = getCrashBlock();
      board[row][column + 1] = getCrashBlock();
      board[row][column - 1] = getCrashBlock();
    });
  } else {
    car.forEach(([row, column]) => {
      board[row][column] = RaceCell.Block;
    });
  }
}
