import { FC } from "react";

import { useAppSelector } from "../../../../redux/hooks";
import { selectUserData } from "../../../../redux/userSlice";

import "./style.scss";

type Props = {
  isUserLossed: boolean;
  timeStart: number;
  onInitState: () => void;
};

export const EndBlockUI: FC<Props> = ({
  isUserLossed,
  timeStart,
  onInitState,
}) => {
  const userData = useAppSelector(selectUserData);

  const timeFinished = new Date(new Date().getTime() - timeStart);

  return (
    <div className={`end-game-block ${isUserLossed ? "lose" : ""}`}>
      <div className="end-game-block_title">{`Game over. You ${
        isUserLossed ? "Lose" : "Win"
      }`}</div>
      <div className="end-game-block_info">
        <span>{`Game time: ${timeFinished.getMinutes()} min ${timeFinished.getSeconds()} sec`}</span>
        <span>{`You missed: ${userData.misses.length}`}</span>
      </div>
      <div className="end-game-block_rematch" onClick={onInitState}>
        Rematch
      </div>
    </div>
  );
};
