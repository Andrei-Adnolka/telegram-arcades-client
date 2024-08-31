import { memo, useCallback, useEffect, useState } from "react";
import { Provider } from "react-redux";

import Field from "./components/field";
import UpcomingBlocks from "./components/upcoming-blocks";
import GameOverUI from "./components/game-over-popup";
import { HeaderUI } from "./components/header";
import { SettingsPopupUI } from "./components/settings-popup";

import { useBlockBlast } from "./hooks/useBlockBlast";
import { store } from "./redux/store";

import "./style.scss";

const BlockBlastGameUI = () => {
  const [isShowPopup, setIsShowPopup] = useState(false);

  const { score, hightScore, isGameOver } = useBlockBlast();

  const onSetState = useCallback(() => {
    setIsShowPopup((prev) => !prev);
  }, []);

  useEffect(() => {
    if (isGameOver) {
      setTimeout(() => {
        setIsShowPopup(true);
      }, 3000);
    }
  }, [isGameOver]);

  return (
    <div className="block-blast">
      <HeaderUI onSetState={onSetState} score={score} hightScore={hightScore} />
      {isShowPopup ? (
        <SettingsPopupUI
          onSetState={onSetState}
          isShowPopup={isShowPopup}
          isGameOver={isGameOver}
        />
      ) : null}
      {isShowPopup && isGameOver ? (
        <div className="block-blast-game-over-popup">
          <GameOverUI hightScore={hightScore} />
        </div>
      ) : null}
      <Field />
      <UpcomingBlocks />
    </div>
  );
};

const BlockBlastGame = () => {
  return (
    <Provider store={store}>
      <BlockBlastGameUI />
    </Provider>
  );
};

export default memo(BlockBlastGame);
