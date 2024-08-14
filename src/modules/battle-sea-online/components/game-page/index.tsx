import { memo, useEffect, useRef } from "react";

import { useAppSelector } from "../../redux/hooks";
import { selectShips } from "../../redux/userSlice";

import UserField from "./components/user-field";
import Field from "./components/field";
import { useStatusText } from "./hooks/useStatusText";
import { selectIsUserShot, selectWinner } from "../../redux/gameSlice";
import { useWss } from "./hooks/useWss";

const GamePageUI = ({ gameId }: { gameId: string }) => {
  const userShips = useAppSelector(selectShips);
  const isUserShot = useAppSelector(selectIsUserShot);
  const winner = useAppSelector(selectWinner);
  const isFirstLoad = useRef(true);
  console.log("winner", winner);
  const {
    isGameReady,
    isUserReady,
    isRivalReady,
    onReady,
    onShoot,
    onConnect,
    rivalName,
    isUserLossed,
    isWinner,
  } = useWss(gameId);

  useEffect(() => {
    if (isFirstLoad.current) {
      onConnect();
      isFirstLoad.current = false;
    }
  }, []);

  const { statusText, statusClassName } = useStatusText(
    userShips.length,
    isUserReady,
    isRivalReady
  );

  const hintText = isUserShot ? "Your Turn" : "Rival Turn";

  const text = "I want to play with you";
  const link = `https://t.me/share/url?url=${document.URL}&text=${text}`;
  const hint = `Share your friend the Game ID: ${gameId}`;

  const InfoBlock = <div>
    You Win
  </div>

  return (
    <div>
      {isUserReady ? null : (
        <div className="battle_sea_wrapper__header">
          <div>{hint}</div>
          <div>
            <a href={link}>Share game to Telegram</a>
          </div>
        </div>
      )}
      <h1>{isGameReady ? hintText : "PLACE SHIPS"}</h1>
      <div className="battle_sea_wrapper__boards">
        <div></div>
        <div className="battle_sea_wrapper__board">
          {isGameReady ? null : (
            <>
              <p>{`${localStorage.nickname.toUpperCase()} (You)`}</p>
              <span className={statusClassName.join(" ")} onClick={onReady}>
                {statusText}
                <div className="loader-2" />
              </span>
              <UserField />
            </>
          )}
          {isGameReady ? (
            <>
              <div className="battle_sea_wrapper__board">
                <p>{`${localStorage.nickname.toUpperCase()} (You)`}</p>
                <Field isRival={false} isOnline />
              </div>
              <div className="battle_sea_wrapper__board">
                {rivalName ? (
                  <>
                    <p>{`${
                      rivalName
                        ? `${rivalName.toUpperCase()} (rival)`
                        : "RIVAL BOARD"
                    }`}</p>
                    <Field isRival isOnline sendSocket={onShoot} />
                  </>
                ) : (
                  <div className="battle_sea_wrapper__wait">
                    <div>WAITING OPPONENT</div>
                    <div className="loader-container"></div>
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
