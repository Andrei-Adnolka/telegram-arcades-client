import { FC } from "react";

import { useAppSelector } from "../../../../redux/hooks";
import { selectLang } from "../../../../redux/gameSlice";

type Props = {
  onInitState: () => void;
};
const l10n = {
  ru: { label: "Ваш соперник покинул игру" },
  eng: { label: "Ваш соперник покинул игру" },
};

export const RivalLeftUI: FC<Props> = () => {
  const lang = useAppSelector(selectLang);

  const { label } = l10n[lang];

  return (
    <div className={`end-game-block lose`}>
      <div className="end-game-block_title">{label}</div>
    </div>
  );
};
