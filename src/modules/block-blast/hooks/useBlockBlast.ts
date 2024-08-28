import { useCallback, useEffect, useState } from "react";

import { addShapeToBoard, getRandomBlock } from "./helpers";
import { BlockShape, Block, BoardShape } from "../../../types";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectIsGameOver, selectScore, startGame } from "../redux/gameSlice";

const startingBlocks = [getRandomBlock(), getRandomBlock(), getRandomBlock()];

export const useBlockBlast = () => {
  const [isStart, setIsStart] = useState(false);
  const [isPause, setIsPause] = useState(false);

  const score = useAppSelector(selectScore);
  const isGameOver = useAppSelector(selectIsGameOver);

  const dispatch = useAppDispatch();

  const pauseGame = useCallback(() => {
    if (isStart) {
      setIsPause((prev) => !prev);
    }
  }, [isStart]);

  useEffect(() => {
    dispatch(startGame());
  }, []);

  return {
    score,
    isStart,
    isPause,
    isGameOver,
    pauseGame,
    hightScore: 0,
  };
};
