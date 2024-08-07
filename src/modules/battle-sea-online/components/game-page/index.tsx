import { memo } from "react";

import { useAppSelector } from "../../redux/hooks";
import { selectShips } from "../../redux/userSlice";

import UserField from "./components/userField";
import Field from "./components/field";
import { useStatusText } from "./hooks/useStatusText";
import { selectIsUserShot } from "../../redux/gameSlice";
import { useWss } from "./hooks/useWss";

const GamePageUI = () => {
  const userShips = useAppSelector(selectShips);
  const isUserShot = useAppSelector(selectIsUserShot);

  const { isGameReady, onReady, rivalName } = useWss();

  const shoot = (shoot: number) => {
    // wss.send(
    //   getSendData("shoot", {
    //     username: localStorage.nickname,
    //     position: shoot,
    //     gameId,
    //   })
    // );
  };

  const { statusText, statusClassName } = useStatusText(userShips.length);

  const hintText = isUserShot ? "Your Turn" : "Rival Turn";

  return (
    <div>
      <h1>PLASE SHIPS</h1>
      <div className="battle_sea_wrapper__boards">
        <div className="battle_sea_wrapper__board">
          {isGameReady ? null : (
            <>
              <p>{(localStorage.nickname || "YOUR BOARD").toUpperCase()}</p>
              <span className={statusClassName.join(" ")} onClick={onReady}>
                {statusText}
              </span>
              <UserField />
            </>
          )}
          {isGameReady ? (
            <>
              <div className="battle_sea_wrapper__board">
                <p>{(localStorage.nickname || "YOUR BOARD").toUpperCase()}</p>
                <Field isRival={false} isOnline />
                <p>{hintText}</p>
              </div>
              <div className="battle_sea_wrapper__board">
                {!rivalName ? (
                  <>
                    <p>{(rivalName || "RIVAL BOARD").toUpperCase()}</p>
                    <Field isRival isOnline sendSocket={shoot} />
                  </>
                ) : (
                  <div className="battle_sea_wrapper__wait">
                    <div>WAITING OPPONENT</div>
                    <div className="loader-container">
                      <div className="loader-2" />
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default memo(GamePageUI);
