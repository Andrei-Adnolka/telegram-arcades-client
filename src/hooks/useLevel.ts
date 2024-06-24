import { useEffect, useState } from "react";

import { LEVELS } from "../constants";

export const useLevel = (score: number) => {
  const [level, setLevel] = useState(1);
  const [speed, setSpeed] = useState(LEVELS[1].speed);

  useEffect(() => {
    const handler = setTimeout(() => {
      LEVELS.forEach((l, i) => {
        if (l.score.start < score && l.score.end <= score) {
          setLevel(i + 1);
          setSpeed(l.speed);
        }
      });
    }, 2000);

    return () => {
      clearTimeout(handler);
    };
  }, [speed, score]);

  return { level, speed };
};
