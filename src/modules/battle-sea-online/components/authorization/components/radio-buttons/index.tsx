import { FC } from "react";

import "./style.scss";

const options = [
  { id: "Create Game", label: "Online game" },
  { id: "Go to game", label: "Go to game" },
  // { id: "Play with AI", label: "Play with AI" },
];

type Props = {
  activeId: string;
};

const RadioButtons: FC<Props> = ({ activeId }) => {
  return (
    <>
      {options.map((option) => {
        return (
          <div className="form_radio_btn">
            <input
              id={option.id}
              type="radio"
              name="radio"
              checked={option.id === activeId}
            />
            <label htmlFor={option.id}>{option.label}</label>
          </div>
        );
      })}
    </>
  );
};

export default RadioButtons;
