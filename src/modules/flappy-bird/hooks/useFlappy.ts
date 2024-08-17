import { useCallback, useEffect } from "react";

import { useInterval } from "../../../hooks/useInterval";
import { useHightScore } from "../../../hooks/useHighScore";

import { useFlappyBoard } from "./useFlappyBoard";
import { COOKIES_HIGHT_SCORE_NAME } from "../constants";

export const useFlappy = () => {
  const [state, dispatchBoardState] = useFlappyBoard();
  const { status, y, pipes, x, prevIds, score } = state;

  const { hightScore, onSendHightScore } = useHightScore(
    COOKIES_HIGHT_SCORE_NAME
  );

  const checkCollision = useCallback(() => {
    const challenge = pipes
      .map(({ topHeight, id }, i) => {
        return {
          x1: x + i * 200,
          y1: topHeight,
          x2: x + i * 200,
          y2: topHeight + 100,
          id,
        };
      })
      .filter((el) => el.x1 > 0 && el.x1 < 288);
    if (y > 512 - 100) {
      dispatchBoardState({ type: "gameOver" });
      onSendHightScore(score);
    }
    if (challenge.length) {
      const { x1, y1, x2, y2, id } = challenge[0];
      if (
        (x1 <= 139 && 139 <= x1 + 52 && y - 28 <= y1) ||
        (x2 <= 139 && 139 <= x2 + 52 && y >= y2)
      ) {
        dispatchBoardState({ type: "gameOver" });
        onSendHightScore(score);
      } else if (x1 < 120 && !prevIds.includes(id)) {
        dispatchBoardState({ type: "setScore" });
        dispatchBoardState({ type: "setPrevId", id: id });
      }
    }
  }, [dispatchBoardState, onSendHightScore, pipes, prevIds, score, x, y]);

  const gameTick = useCallback(() => {
    dispatchBoardState({ type: "fall" });
    dispatchBoardState({ type: "running" });
  }, [dispatchBoardState]);

  useInterval(() => {
    if (status !== "playing") {
      return;
    }
    dispatchBoardState({ type: "generate" });
  }, 800);

  useInterval(() => {
    if (status !== "playing") {
      return;
    }
    gameTick();
  }, 150);

  useInterval(() => {
    if (status !== "playing") {
      return;
    }
    checkCollision();
  }, 10);

  useEffect(() => {
    const foreground = document.getElementById("foreground");
    const handleKeyPress = () => {
      if (status === "playing") {
        dispatchBoardState({ type: "fly" });
      }
    };

    foreground?.addEventListener?.("touchstart", handleKeyPress);
    return () => {
      foreground?.removeEventListener?.("touchstart", handleKeyPress);
    };
  }, [status, dispatchBoardState]);

  const startGame = useCallback(() => {
    dispatchBoardState({ type: "start" });
  }, [dispatchBoardState]);

  return { ...state, hightScore, startGame, isPlaying: status === "playing" };
};
