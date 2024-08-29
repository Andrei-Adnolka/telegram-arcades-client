import { useEffect } from "react";

import { ReloadButton } from "../reload-button";

import { useAppSelector } from "../../redux/hooks";
import { selectScore } from "../../redux/gameSlice";

import "./style.scss";

const ID = "blast-game-over-over-popup";

const GameOverUI = () => {
  const score = useAppSelector(selectScore);

  useEffect(() => {
    let i = 0;
    const block = document.getElementById(ID);
    const nIntervId = setInterval(() => {
      if (i >= score) {
        clearInterval(nIntervId);
      } else {
        ++i;
      }
      if (block) {
        block.innerHTML = `${i}`;
      }
    }, 20);
  }, [score]);

  return (
    <div className="blast-game-over">
      <div className="blast-game-over-count">
        <span>Ваш счет</span>
        <span id={ID} />
      </div>
      <ReloadButton />
    </div>
  );
};

export default GameOverUI;
