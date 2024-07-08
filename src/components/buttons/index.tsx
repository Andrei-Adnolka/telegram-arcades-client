import { memo, TouchEvent } from "react";

import { ButtonIds } from "../../constants";
import { useTelegram } from "../../provider/telegram";

import { ContinueSvg } from "../../svg/continue";
import { RotateSvg } from "../../svg/rotate";

import "./style.scss";

const BUTTONS = [
  { id: ButtonIds.Left, className: "button left gray" },
  { id: ButtonIds.Right, className: "button right gray" },
  { id: ButtonIds.Bottom, className: "button bottom gray" },
  { id: ButtonIds.Top, className: "button top gray" },
];

type Props = {
  onClick?: (id: ButtonIds, isTouchStart: boolean) => void;
};

function ButtonsUI({ onClick }: Props) {
  const { webApp } = useTelegram();

  const handleClick = (event: TouchEvent<HTMLButtonElement>) => {
    webApp?.HapticFeedback?.impactOccurred?.("soft");
    onClick?.(event.currentTarget.id as ButtonIds, event.type === "touchstart");
  };

  return (
    <div className="buttons">
      <div className="buttons__left">
        {BUTTONS.map(({ id, className }) => (
          <button
            id={id}
            className={className}
            key={id}
            onTouchStart={handleClick}
          >
            <ContinueSvg />
          </button>
        ))}
      </div>
      <div className="buttons__right">
        <button
          id={ButtonIds.Rotate}
          className="button buttons__right__turn gray"
          onTouchStart={handleClick}
          onTouchEnd={handleClick}
        >
          <RotateSvg />
        </button>
      </div>
    </div>
  );
}

export default memo(ButtonsUI);
