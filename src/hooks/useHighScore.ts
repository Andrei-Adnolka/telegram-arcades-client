import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";

export const useHightScore = (name: string) => {
  const [hightScore, setHightScore] = useState("0");
  const score = Cookies.get(name);

  const onSendHightScore = useCallback(
    (value: string) => {
      if (!score || +score > +value) {
        setHightScore(value);
        Cookies.set(name, value, { expires: 30 });
      }
    },
    [name, score]
  );

  useEffect(() => {
    if (score) {
      setHightScore(score);
    }
  }, [name, score]);

  return { hightScore, onSendHightScore };
};
