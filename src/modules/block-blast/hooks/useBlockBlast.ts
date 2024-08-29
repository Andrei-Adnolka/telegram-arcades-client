import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectIsGameOver, selectScore, startGame } from "../redux/gameSlice";
import { useHightScore } from "../../../hooks/useHighScore";
import { COOKIES_HIGHT_SCORE_NAME } from "../constants";

export const useBlockBlast = () => {
  const score = useAppSelector(selectScore);
  const isGameOver = useAppSelector(selectIsGameOver);

  const { hightScore, onSendHightScore } = useHightScore(
    COOKIES_HIGHT_SCORE_NAME
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(startGame());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isGameOver) {
      onSendHightScore(score);
    }
  }, [isGameOver, score, onSendHightScore]);

  return { score, isGameOver, hightScore };
};
