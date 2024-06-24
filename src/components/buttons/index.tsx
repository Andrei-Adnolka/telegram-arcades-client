import { memo } from "react";
import { ButtonIds } from "../../constants";

import { ContinueSvg } from "../../svg/continue";

import "./style.scss";

const BUTTONS = [
  { id: ButtonIds.Left, className: "button left gray" },
  { id: ButtonIds.Right, className: "button right gray" },
  { id: ButtonIds.Bottom, className: "button bottom gray" },
  { id: ButtonIds.Top, className: "button top gray" },
];

function ButtonsUI() {
  return (
    <div className="buttons">
      <div className="buttons__left">
        {BUTTONS.map(({ id, className }) => (
          <button id={id} className={className} key={id}>
            <ContinueSvg />
          </button>
        ))}
      </div>
      <div className="buttons__right">
        <button
          id={ButtonIds.Rotate}
          className="button buttons__right__turn gray"
        ></button>
      </div>
    </div>
  );
}

export default memo(ButtonsUI);
