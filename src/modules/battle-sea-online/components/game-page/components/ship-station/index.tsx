import { memo } from "react";

import { useGetSettedShips } from "../../hooks/useGetSettedShips";

import Ship from "../ship";

import "./index.scss";
import { useAppDispatch } from "../../../../redux/hooks";
import { resetShips, setRandomShips } from "../../../../redux/userSlice";

const ShipStation = () => {
  const { restShips } = useGetSettedShips();

  const dispatch = useAppDispatch();

  const resetUserShips = () => {
    dispatch(resetShips());
  };
  const setRandomUserShips = () => {
    dispatch(setRandomShips());
  };

  return (
    <div className="ship-station">
      {restShips.length ? (
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
