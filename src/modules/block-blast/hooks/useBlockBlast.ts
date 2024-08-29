import { useEffect, useRef } from "react";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  selectBlocks,
  selectBoard,
  selectIsGameOver,
  selectScore,
  setState,
  startGame,
} from "../redux/gameSlice";
import { useHightScore } from "../../../hooks/useHighScore";
import { COOKIES_HIGHT_SCORE_NAME, STORAGE_NAME } from "../constants";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import isEqual from "lodash.isequal";
import { useUpdateEffect } from "../../../hooks/useUpdateEffect";

const useLocalStorageData = () => {
  const score = useAppSelector(selectScore);
  const isGameOver = useAppSelector(selectIsGameOver);
  const board = useAppSelector(selectBoard, isEqual);
  const blocks = useAppSelector(selectBlocks, isEqual);
  const isFirstLoad = useRef(false);

  const dispatch = useAppDispatch();

  const { getItem, setItem, removeItem } = useLocalStorage(STORAGE_NAME);

  useUpdateEffect(() => {
    setItem({ score, board, blocks });
    if (isGameOver) {
      removeItem();
    }
  }, [score, board, blocks, setItem, removeItem, isGameOver]);

  useEffect(() => {
    if (!isFirstLoad.current) {
      const data = getItem();
      if (data?.score) {
        dispatch(setState(data));
      } else {
        dispatch(startGame());
      }
    }
    isFirstLoad.current = true;
  }, [dispatch, getItem]);
};

export const useBlockBlast = () => {
  const score = useAppSelector(selectScore);
  const isGameOver = useAppSelector(selectIsGameOver);

  const { hightScore, onSendHightScore } = useHightScore(
    COOKIES_HIGHT_SCORE_NAME
  );

  useLocalStorageData();

  useEffect(() => {
    if (isGameOver) {
      onSendHightScore(score);
    }
  }, [isGameOver, score, onSendHightScore]);

  return { score, isGameOver, hightScore };
};
