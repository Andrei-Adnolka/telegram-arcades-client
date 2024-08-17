import { memo } from "react";

import { useGetSettedShips } from "../../hooks/useGetSettedShips";

import Ship from "../ship";

import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { resetShips, setRandomShips } from "../../../../redux/userSlice";
import { selectLang } from "../../../../redux/gameSlice";

import "./index.scss";

const BLOCK_ID = "ship-station";

const l10n = {
  ru: { random: "Случайный образом", reset: "С чистого листа" },
  eng: { random: "Randomise", reset: "Reset" },
};

const ShipStation = () => {
  const { restShips, countShips } = useGetSettedShips();
  const lang = useAppSelector(selectLang);
  const { random, reset } = l10n[lang];

  const dispatch = useAppDispatch();

  const resetUserShips = () => {
    dispatch(resetShips());
    setTimeout(() => {
      document
        .getElementById(BLOCK_ID)
        ?.scrollIntoView({ block: "start", behavior: "smooth" });
    }, 0);
  };
  const setRandomUserShips = () => {
    dispatch(setRandomShips());
  };

  return (
    <div className="ship-station" id={BLOCK_ID}>
      {countShips ? (
        <div className="ship-station_container">
          {restShips.map((decks, i) => {
            const randomId = Math.random();
            return (
              <Ship decks={decks} key={randomId} id={randomId.toString()} />
            );
          })}
        </div>
      ) : null}
      <div className="ship-station_discription">
        <button className="ship-station_button" onClick={setRandomUserShips}>
          {random}
        </button>
        <button className="ship-station_button" onClick={resetUserShips}>
          {reset}
        </button>
      </div>
    </div>
  );
};

export default memo(ShipStation);
