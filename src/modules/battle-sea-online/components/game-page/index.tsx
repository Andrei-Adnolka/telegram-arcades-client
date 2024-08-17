import { memo } from "react";

import { useAppSelector } from "../../redux/hooks";

import UserField from "./components/user-field";
import Field from "./components/field";
import { EndBlockUI } from "./components/end-block";
import { SystemTextUI } from "./components/system-text";
import { selectIsUserShot } from "../../redux/gameSlice";
import { useWss } from "./hooks/useWss";

const GamePageUI = ({ gameId }: { gameId: string }) => {
  const isUserShot = useAppSelector(selectIsUserShot);

  const {
    isGameReady,
    isUserReady,
    isRivalReady,
    onReady,
    onShoot,
    rivalName,
    isUserLossed,
    isWinner,
    timeStart,
    onInitState,
    skipIsUserReady,
  } = useWss(gameId);

  let hintText = isUserShot ? "Your Turn" : "Rival Turn";
  if (isUserLossed || isWinner) {
    hintText = isUserLossed ? "You lose" : "You Win";
  }

  const text = `I want to play with you, please go to battleship and enter this code ${gameId}`;
  const link = `https://t.me/share/url?url=https://t.me/Arcade_Games_BY_VAOM_Bot&text=${text}`;
  const hint = `Share your friend the Game ID: <b>${gameId}</b>`;
  const isShowEndGameBlock = isWinner || isUserLossed;

  return (
    <div>
      {isUserReady || isShowEndGameBlock ? null : (
        <div className="battle_sea_wrapper__header">
          <div dangerouslySetInnerHTML={{ __html: hint }} />
          <div>
            <a href={link}>Share the Game ID to Telegram</a>
          </div>
        </div>
      )}
      {isShowEndGameBlock ? (
        <EndBlockUI
          isUserLossed={isUserLossed}
          timeStart={timeStart}
          onInitState={onInitState}
        />
      ) : null}
      <h1>{isGameReady || isShowEndGameBlock ? hintText : "PLACE SHIPS"}</h1>
      <div
        className={`battle_sea_wrapper__boards ${
          isShowEndGameBlock ? "end-block" : ""
        }`}
      >
        <div className="battle_sea_wrapper__boards">
          {isGameReady || isShowEndGameBlock ? null : (
            <>
              <p>{`${localStorage.nickname.toUpperCase()} (You)`}</p>
              <SystemTextUI
                isRivalReady={isRivalReady}
                isUserReady={isUserReady}
                onReady={onReady}
                skipIsUserReady={skipIsUserReady}
              />
              <UserField isUserReady={isUserReady} />
            </>
          )}
          {isGameReady || isShowEndGameBlock ? (
            <>
              <div className="battle_sea_wrapper__board">
                <p>{`${localStorage.nickname.toUpperCase()} (You)`}</p>
                <Field isRival={false} isOnline isUserBoard />
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
