import { FC, useMemo } from "react";
import { UniqueIdentifier, useDraggable } from "@dnd-kit/core";

import { ICell } from "./types";
import { CELLCLASS } from "./constants";

import "./index.scss";

const Cell: FC<ICell> = ({ id, coordinate, isRival, personState }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: id as UniqueIdentifier,
  });

  const classList = useMemo(() => {
    const { shoot, initial, miss, boat, destroyed } = CELLCLASS;
    let classList = initial as string;
    personState.ships.forEach((ship) => {
      classList += ship.woundedCells.includes(coordinate) ? shoot : "";
      classList +=
        ship.shipLocation.includes(coordinate) && !isRival ? boat : "";
      classList +=
        ship.woundedCells.includes(coordinate) &&
        ship.woundedCells.length === ship.decks
          ? destroyed
          : "";
    });

    personState.misses.forEach((id) => {
      classList += id === coordinate ? miss : "";
    });
    personState.notAllowed.forEach((id) => {
      classList += id === coordinate ? miss : "";
    });

    return classList;
  }, [personState.ships, personState.notAllowed, personState.misses]);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
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
