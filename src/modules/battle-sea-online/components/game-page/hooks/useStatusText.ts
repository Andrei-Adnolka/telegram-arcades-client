import { selectLang } from "../../../redux/gameSlice";
import { useAppSelector } from "../../../redux/hooks";

const l10n = {
  ru: {
    status: "Ваши корабли готовы! Играем?",
    placeShips: "Разместите корабли",
    waiting: "Ожидание соперника",
  },
  eng: {
    status: "Your ships are ready! Let's play?",
    placeShips: "Place the ships",
    waiting: "Waiting the Rival",
  },
};

export const useStatusText = (
  userShipsLength: number,
  isUserReady: boolean,
  isRivalReady: boolean
) => {
  const lang = useAppSelector(selectLang);
  const { status, placeShips, waiting } = l10n[lang];

  let statusText = status;
  const statusClassName = ["sistem_message"];
  const isNotReadyShips = userShipsLength !== 10;

  if (isNotReadyShips) {
    statusText = placeShips;
    statusClassName.push("sistem_message__not_ready");
  } else if (isUserReady && !isRivalReady) {
    statusText = waiting;
    statusClassName.push("sistem_message__not_rival_ready");
  }

  return { statusText, statusClassName };
};
