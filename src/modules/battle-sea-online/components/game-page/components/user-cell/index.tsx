import { FC, useMemo } from "react";
import { UniqueIdentifier, useDraggable } from "@dnd-kit/core";

import { CELLCLASS } from "./constants";

import "./index.scss";
import { IShip } from "../../types";

const Cell: FC<{ coordinate: number; id: string; ships: IShip[] }> = ({
  id,
  coordinate,
  ships,
}) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: id as UniqueIdentifier,
  });

  const classList = useMemo(() => {
    const { initial, boat } = CELLCLASS;
    let classList = initial as string;
    ships.forEach((ship) => {
      classList += ship.shipLocation.includes(coordinate) ? boat : "";
    });

    return classList;
  }, [ships]);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      id={coordinate.toString()}
      className={classList}
    />
  );
};

export default Cell;
