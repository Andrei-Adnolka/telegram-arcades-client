import { useEffect, useState } from "react";

import { LEVELS } from "../constants";

export const useLevel = (score: number) => {
  const [level, setLevel] = useState(1);
  const [speed, setSpeed] = useState(LEVELS[1].speed);

  useEffect(() => {
    if (score) {
      LEVELS.forEach((l, i) => {
        if (l.score.start < score && l.score.end <= score) {
          setLevel(i + 1);
          setSpeed(l.speed);
        }
      });
    }
  }, [speed, score]);

  return { level, speed };
};
