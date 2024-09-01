import { useContext, useEffect, useRef } from "react";
import { GameContext } from "../context/game-context";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { STORAGE_NAME } from "../constants";

export const useInitStartGame = () => {
  const { startGame, setOldState } = useContext(GameContext);
  const { getItem } = useLocalStorage(STORAGE_NAME);

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current === false) {
      const data = getItem();
      !data ? startGame() : setOldState(data);
      initialized.current = true;
    }
    // eslint-disable-next-line
  }, [startGame]);
};
