import { FC, useCallback, useEffect, useRef } from "react";
import { ReloadButton } from "../reload-button";

type Props = {
  onSetState: () => void;
  isShowPopup: boolean;
  isGameOver: boolean;
};

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

export const SettingsPopupUI: FC<Props> = ({
  isShowPopup,
  isGameOver,
  onSetState,
}) => {
  const myRef = useRef(null);

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
  );
};
