import { useCallback, useEffect, useState } from "react";

export const LEVELS = [
  { level: 1, speed: 630, score: { start: 0, end: 2000 } },
  { level: 2, speed: 580, score: { start: 2000, end: 5000 } },
  { level: 3, speed: 500, score: { start: 5000, end: 7500 } },
  { level: 4, speed: 450, score: { start: 7500, end: 10000 } },
  { level: 5, speed: 400, score: { start: 10000, end: 12500 } },
  { level: 6, speed: 300, score: { start: 12500, end: 15000 } },
  { level: 7, speed: 200, score: { start: 15000, end: 20000 } },
  { level: 8, speed: 150, score: { start: 20000, end: 25000 } },
  { level: 9, speed: 110, score: { start: 25000, end: 1000000000 } },
];

const DEFAULT_LEVEL = LEVELS[0];

export const useLevel = (score: number, levels: (typeof DEFAULT_LEVEL)[]) => {
  const [level, setLevel] = useState(DEFAULT_LEVEL.level);
  const [speed, setSpeed] = useState(DEFAULT_LEVEL.speed);

  const setToState = useCallback(
    (arg: number) => {
      levels.forEach((l) => {
        if (l.score.start < arg && l.score.end >= arg) {
          setLevel(l.level);
          setSpeed(l.speed);
        }
      });
    },
    [levels]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setToState(score);
    }, 2000);
    return () => {
      clearTimeout(handler);
    };
  }, [speed, score, setToState]);

  return { level, speed, setLevel: setToState };
};
