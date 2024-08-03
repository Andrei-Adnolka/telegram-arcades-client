import { FC } from "react";

import { useGetSettedShips } from "../../hooks/useGetSettedShips";

import Ship from "../ship";

import "./index.scss";
import { useStateContextActions } from "../../../../context";

type Props = {
  isReady: boolean;
};

const ShipStation: FC<Props> = ({ isReady }) => {
  const { restShips } = useGetSettedShips();
  const { resetShips, setRandomShips } = useStateContextActions();

  if (!isReady) {
    return (
      <div className="ship-station">
        <div className="ship-station_container">
          {restShips.map((decks, i) => (
            <Ship decks={decks} key={i} />
          ))}
        </div>
        <div className="ship-station_discription">
          <button className="ship-station_button" onClick={setRandomShips}>
            random
          </button>
          <button className="ship-station_button" onClick={resetShips}>
            reset
          </button>
          dragAndDrop
        </div>
      </div>
    );
  }

  return null;
};

export default ShipStation;
