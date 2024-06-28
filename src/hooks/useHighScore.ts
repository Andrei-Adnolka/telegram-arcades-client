import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";

export const useHightScore = (name: string) => {
  const [hightScore, setHightScore] = useState(0);
  const score = Cookies.get(name) || 0;

  const onSendHightScore = useCallback(
    (value: number) => {
      if (!+score || +score < value) {
        setHightScore(value);
        Cookies.set(name, value.toString(), { expires: 7 });
      }
    },
    [name, score]
  );

  useEffect(() => {
    if (+score) {
      setHightScore(+score);
    }
  }, [name, score]);

  return { hightScore, onSendHightScore };
};
