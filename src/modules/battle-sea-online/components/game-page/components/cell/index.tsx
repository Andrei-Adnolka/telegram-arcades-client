import { FC, useMemo } from "react";

import { ICell } from "./types";
import { CELLCLASS } from "./constants";

const Cell: FC<ICell> = ({
  coordinate,
  isRival,
  ships,
  notAllowed,
  misses,
}) => {
  const classList = useMemo(() => {
    const { shoot, initial, miss, boat, destroyed } = CELLCLASS;
    let classList = initial as string;
    ships.forEach((ship) => {
      classList += ship.woundedCells.includes(coordinate) ? shoot : "";
      classList +=
        ship.shipLocation.includes(coordinate) && !isRival ? boat : "";
      classList +=
        ship.woundedCells.includes(coordinate) &&
        ship.woundedCells.length === ship.decks
          ? destroyed
          : "";
    });

    misses.forEach((id) => {
      classList += id === coordinate ? miss : "";
    });
    notAllowed.forEach((id) => {
      classList += id === coordinate ? miss : "";
    });

    return classList;
  }, [ships, notAllowed, misses, coordinate, isRival]);

  return (
    <div
      id={coordinate.toString()}
      className={classList}
      style={{
        backgroundImage: classList.includes("destroyed")
          ? "url(/battleship/fire.png)"
          : "",
      }}
    />
  );
};

export default Cell;
