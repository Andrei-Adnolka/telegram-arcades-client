import { FC, useEffect } from "react";

import { ReloadButton } from "../reload-button";

import { useAppSelector } from "../../redux/hooks";
import { selectScore } from "../../redux/gameSlice";

import "./style.scss";

const ID = "blast-game-over-over-popup";

type Props = {
  hightScore: number;
};

const GameOverUI: FC<Props> = ({ hightScore }) => {
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
        <span>Лучший счет</span>
        <span>{hightScore}</span>
        <span>Ваш счет</span>
        <span id={ID} />
      </div>
      <ReloadButton />
    </div>
  );
};

export default GameOverUI;
