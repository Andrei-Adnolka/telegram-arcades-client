import { memo } from "react";

import { useAppSelector } from "../../redux/hooks";

import UserField from "./components/user-field";
import Field from "./components/field";
import { EndBlockUI } from "./components/end-block";
import { RivalLeftUI } from "./components/rival-left-block";
import { SystemTextUI } from "./components/system-text";
import { selectIsUserShot, selectLang } from "../../redux/gameSlice";
import { useWss } from "./hooks/useWss";

const l10n = {
  ru: {
    yourTurn: "Ваш ход",
    rivalTurn: "Ход соперника",
    youWin: "Вы выйграли",
    youLose: "Вы проиграли",
    hintShareId: "Код игры: ",
    shareTelegramHint: "Поделиться кодом игры в телеграм",
    hintShareText:
      "Я хочу поиграть с тобой! Пожалуйста, зайди в игру 'Battleship online', введи свое и имя и введи этот код игры: ",
    rivalBoard: "КОРАБЛИ СОПЕРНИКА",
    you: "Ваши корабли",
    rival: "Корабли соперника",
  },
  eng: {
    yourTurn: "Your turn",
    rivalTurn: "Rival turn",
    youWin: "You win",
    youLose: "You lose",
    hintShareId: "Share your friend the Game ID: ",
    shareTelegramHint: "Share the Game ID to Telegram",
    hintShareText:
      "I want to play with you, please go to battleship and enter this code:  ",
    rivalBoard: "RIVAL BOARD",
    you: "Your ships",
    rival: "Rival ships",
  },
};

const GamePageUI = ({ gameId }: { gameId: string }) => {
  const isUserShot = useAppSelector(selectIsUserShot);
  const lang = useAppSelector(selectLang);
  const {
    yourTurn,
    rivalTurn,
    youWin,
    youLose,
    hintShareId,
    hintShareText,
    shareTelegramHint,
    you,
    rival,
    rivalBoard,
  } = l10n[lang];

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
    isRivalLeft,
    onInitState,
    skipIsUserReady,
  } = useWss(gameId);

  let hintText = isUserShot ? yourTurn : rivalTurn;
  if (isUserLossed || isWinner) {
    hintText = isUserLossed ? youLose : youWin;
  }

  const text = `${hintShareText} ${gameId}`;
  const link = `https://t.me/share/url?url=https://t.me/Arcade_Games_BY_VAOM_Bot&text=${text}`;
  const hint = `${hintShareId} <b>${gameId}</b>`;
  const isShowEndGameBlock = isWinner || isUserLossed;

  return (
    <div>
      {isUserReady || isShowEndGameBlock ? null : (
        <div className="battle_sea_wrapper__header">
          <div dangerouslySetInnerHTML={{ __html: hint }} />
          <div>
            <a href={link}>{shareTelegramHint}</a>
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
      {isRivalLeft ? <RivalLeftUI onInitState={onInitState} /> : null}
      {isGameReady || isShowEndGameBlock ? <h1>{hintText}</h1> : null}
      <div
        className={`battle_sea_wrapper__boards ${
          isShowEndGameBlock ? "end-block" : ""
        }`}
      >
        <div className="battle_sea_wrapper__boards">
          {isGameReady || isShowEndGameBlock ? null : (
            <>
              <p>{`${localStorage.nickname.toUpperCase()} (${you})`}</p>
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
              <div>
                <p>{`${localStorage.nickname.toUpperCase()} (${you})`}</p>
                <Field isRival={false} isOnline isUserBoard />
              </div>
              <div style={{ marginTop: "32px", marginBottom: "32px" }}>
                {rivalName ? (
                  <>
                    <p>{`${
                      rivalName
                        ? `${rivalName.toUpperCase()} (${rival})`
                        : rivalBoard
                    }`}</p>
                    <Field isRival isOnline sendSocket={onShoot} />
                  </>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default memo(GamePageUI);
