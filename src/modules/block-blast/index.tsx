import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Provider } from "react-redux";

import Field from "./components/field";
import UpcomingBlocks from "./components/upcoming-blocks";
import GameOverUI from "./components/game-over-popup";

import { useBlockBlast } from "./hooks/useBlockBlast";
import { store } from "./redux/store";

import "./style.scss";
import { ReloadButton } from "./components/reload-button";

const CrossSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <g fill="#FFF">
      <path
        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
        transform="translate(-644 -630) translate(516 624) translate(128 6)"
      />
    </g>
  </svg>
);

const SettingsSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <g fill="CurrentColor">
      <path
        d="M14.264 1c.252 0 .467.156.544.377l.022.085.418 2.915c.594.23 1.117.527 1.615.868l.296.21 2.816-1.1c.221-.088.487-.02.639.167l.05.075 2.263 3.806c.118.212.09.466-.063.636l-.073.068-2.386 1.793c.045.374.079.737.079 1.1 0 .242-.015.48-.039.715l-.04.352 2.386 1.826c.188.144.255.39.178.611l-.042.093-2.262 3.806c-.119.212-.367.306-.594.267l-.096-.025-2.816-1.111c-.49.367-.996.68-1.563.94l-.348.149-.418 2.915c-.04.235-.233.417-.473.455l-.093.007H9.741c-.252 0-.467-.156-.544-.377l-.022-.085-.418-2.915c-.61-.236-1.147-.544-1.658-.905l-.253-.184-2.816 1.111c-.218.077-.479.02-.631-.159l-.059-.083-2.262-3.806c-.13-.215-.091-.474.07-.644l.066-.06L3.6 13.067c-.045-.352-.079-.704-.079-1.067 0-.242.015-.484.039-.73l.04-.37-2.386-1.793c-.19-.147-.266-.398-.177-.622l.041-.082L3.34 4.597c.12-.215.375-.317.605-.268l.085.026 2.816 1.1c.49-.357.996-.677 1.563-.932l.348-.146.418-2.915c.04-.235.233-.417.473-.455L9.741 1h4.523zM13.03 3h-2.055l-.405 2.82-1.093.423c-.474.183-.923.441-1.452.828l-.886.646-2.7-1.055-.972 1.636 2.257 1.696-.162 1.355c-.028.263-.04.466-.04.651 0 .183.012.379.039.621l.17 1.334-2.27 1.737.976 1.642 2.713-1.07.894.669c.51.38.957.64 1.433.824l1.093.422.405 2.821h2.055l.402-2.803 1.071-.43c.511-.205.971-.47 1.458-.834l.894-.67 2.713 1.072.976-1.643-2.27-1.737.17-1.334.03-.333c.007-.102.01-.197.01-.288 0-.185-.013-.388-.04-.651l-.163-1.355 2.257-1.696-.972-1.636-2.7 1.055-.886-.646c-.529-.387-.978-.645-1.452-.828l-1.093-.422L13.03 3zM12 8c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0 2c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2z"
        transform="translate(-3629 -1141) translate(3612 758) translate(17 383)"
      />
    </g>
  </svg>
);

const CrownSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24px"
    height="24px"
    viewBox="0 0 22 22"
  >
    <g fill="#ccc80b">
      <path d="M 11.695312 4.566406 C 11.617188 4.597656 11.5 4.691406 11.4375 4.765625 C 11.371094 4.84375 10.414062 6.265625 9.304688 7.9375 C 7.921875 10.023438 7.265625 10.964844 7.21875 10.953125 C 7.179688 10.945312 6.101562 10.335938 4.828125 9.605469 C 2.539062 8.292969 2.503906 8.273438 2.242188 8.273438 C 1.953125 8.273438 1.800781 8.351562 1.625 8.585938 C 1.4375 8.835938 1.457031 8.949219 2.265625 12.421875 L 3.03125 15.726562 L 20.96875 15.726562 L 21.734375 12.421875 C 22.542969 8.949219 22.5625 8.835938 22.375 8.585938 C 22.195312 8.351562 22.046875 8.273438 21.753906 8.273438 L 21.484375 8.273438 L 19.453125 9.625 C 17.503906 10.925781 17.421875 10.972656 17.34375 10.890625 C 17.300781 10.84375 16.195312 9.425781 14.886719 7.75 C 13.578125 6.066406 12.460938 4.65625 12.394531 4.609375 C 12.234375 4.503906 11.875 4.480469 11.695312 4.566406 Z M 11.695312 4.566406 " />
      <path d="M 3.425781 17.421875 C 3.804688 19.125 3.824219 19.175781 4.097656 19.378906 L 4.222656 19.476562 L 19.777344 19.476562 L 19.902344 19.378906 C 20.175781 19.175781 20.195312 19.125 20.574219 17.421875 L 20.617188 17.25 L 3.382812 17.25 Z M 3.425781 17.421875 " />
    </g>
  </svg>
);

const BlockBlastGameUI = () => {
  const [isShowPopup, setIsShowPopup] = useState(false);
  const myRef = useRef(null);

  const { score, hightScore, isGameOver } = useBlockBlast();

  useEffect(() => {
    const root = document.getElementById("root");
    if (root?.style) {
      root.style.backgroundColor = "#4a60a6";
    }
    document.body.style.overflow = "hidden";
  }, []);

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

  const onOutsideClick = useCallback(
    (e: MouseEvent) => {
      if (isShowPopup && !isGameOver) {
        // @ts-ignore
        if (!myRef?.current?.contains?.(e.target)) {
          onSetState();
        }
      }
    },
    [onSetState, isShowPopup, isGameOver]
  );

  useEffect(() => {
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, [onOutsideClick]);

  return (
    <>
      <div className="block-blast-header">
        <div>
          {CrownSvg}
          {hightScore}
        </div>
        <div>{score}</div>
        <div onClick={onSetState} className="block-blast-settings">
          {SettingsSvg}
        </div>
      </div>
      {isShowPopup ? (
        <div className="block-blast-settings-popup" ref={myRef}>
          <div
            className="block-blast-settings-popup-cross-svg"
            onClick={onSetState}
          >
            {CrossSvg}
          </div>
          <div className="block-blast-settings-popup-title">Настройки</div>
          <ReloadButton isShowText />
        </div>
      ) : null}
      {isShowPopup && isGameOver ? (
        <div className="block-blast-game-over-popup">
          <GameOverUI hightScore={hightScore} />
        </div>
      ) : null}
      <Field />
      <UpcomingBlocks />
    </>
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
