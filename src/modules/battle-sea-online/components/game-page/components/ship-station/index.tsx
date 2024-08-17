import { memo, useEffect } from "react";

import { useGetSettedShips } from "../../hooks/useGetSettedShips";

import Ship from "../ship";

import "./index.scss";
import { useAppDispatch } from "../../../../redux/hooks";
import { resetShips, setRandomShips } from "../../../../redux/userSlice";

const BLOCK_ID = "ship-station";

const ShipStation = () => {
  const { restShips, countShips } = useGetSettedShips();

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

  useEffect(() => {
    document.body.style.overflow = countShips ? "hidden" : "auto";
  }, [countShips]);

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
          random
        </button>
        <button className="ship-station_button" onClick={resetUserShips}>
          reset
        </button>
      </div>
      <p>dragAndDrop</p>
    </div>
  );
};

export default memo(ShipStation);
