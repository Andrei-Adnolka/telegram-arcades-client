import { useEffect, useState } from "react";

export const LEVELS = [
  { speed: 190, score: { start: 0, end: 2000 } },
  { speed: 170, score: { start: 2000, end: 5000 } },
  { speed: 150, score: { start: 5000, end: 7500 } },
  { speed: 130, score: { start: 7500, end: 10000 } },
  { speed: 110, score: { start: 10000, end: 12500 } },
  { speed: 90, score: { start: 12500, end: 15000 } },
  { speed: 70, score: { start: 15000, end: 20000 } },
  { speed: 60, score: { start: 20000, end: 25000 } },
  { speed: 40, score: { start: 25000, end: 1000000000 } },
];

export const useLevel = (score: number) => {
  const [level, setLevel] = useState(1);
  const [speed, setSpeed] = useState(LEVELS[0].speed);

  useEffect(() => {
    const handler = setTimeout(() => {
      LEVELS.forEach((l) => {
        if (l.score.start < score && l.score.end <= score) {
          setLevel((prev) => prev + 1);
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
