import { FC } from "react";

import { useAppSelector } from "../../../../redux/hooks";
import { selectUserData } from "../../../../redux/userSlice";

import "./style.scss";
import { selectLang } from "../../../../redux/gameSlice";

type Props = {
  isUserLossed: boolean;
  timeStart: number;
  onInitState: () => void;
};
const l10n = {
  ru: {
    gameOver: "Игра окончена. Вы ",
    win: "Выйграли",
    lose: "Проиграли",
    revenge: "Реванш",
    restart: "Заново",
    gameTime: "Время игры:",
    youMissed: "Вы промахнулись:",
  },
  eng: {
    gameOver: "Game over. You ",
    win: "Win",
    lose: "Lose",
    revenge: "Revenge",
    restart: "Rematch",
    gameTime: "Game time:",
    youMissed: "You missed:",
  },
};

export const EndBlockUI: FC<Props> = ({
  isUserLossed,
  timeStart,
  onInitState,
}) => {
  const userData = useAppSelector(selectUserData);
  const lang = useAppSelector(selectLang);

  const { gameOver, win, lose, revenge, restart, gameTime, youMissed } =
    l10n[lang];

  const timeFinished = new Date(new Date().getTime() - timeStart);
  return (
    <div className={`end-game-block ${isUserLossed ? "lose" : ""}`}>
      <div className="end-game-block_title">{`${gameOver} ${
        isUserLossed ? lose : win
      }`}</div>
      <div className="end-game-block_info">
        <span>{`${gameTime} ${timeFinished.getMinutes()} min ${timeFinished.getSeconds()} sec`}</span>
        <span>{`${youMissed} ${userData.misses.length}`}</span>
      </div>
      <div className="end-game-block_rematch" onClick={onInitState}>
        {isUserLossed ? revenge : restart}
      </div>
    </div>
  );
};
