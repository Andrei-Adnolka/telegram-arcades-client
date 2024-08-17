import { FC } from "react";

import "./style.scss";
import { useAppSelector } from "../../../../redux/hooks";
import { selectLang } from "../../../../redux/gameSlice";

const options = [
  {
    id: "Create Game",
    labels: { ru: "Создать игру", eng: "Create game" },
  },
  {
    id: "Go to game",
    labels: { ru: "Подключится", eng: "Connect" },
  },
  // { id: "Play with AI", label: "Play with AI" },
];

type Props = {
  activeId: string;
};

const RadioButtons: FC<Props> = ({ activeId }) => {
  const lang = useAppSelector(selectLang);
  return (
    <>
      {options.map((option) => {
        return (
          <div className="form_radio_btn" key={option.id}>
            <input
              id={option.id}
              type="radio"
              name="radio"
              checked={option.id === activeId}
            />
            <label htmlFor={option.id}>{option.labels[lang]}</label>
          </div>
        );
      })}
    </>
  );
};

export default RadioButtons;
