import { DragMoveEvent } from "@dnd-kit/core";

import { IShip } from "../../types";

import { isCanDrop } from "../ShipsPlacer/isCanDrop";

import {
  filteredShips,
  getActiveId,
  getBoardCollisions,
  getIsCorrentDots,
  getNewShipLocation,
} from "./helpers";

export const dragOver = (
  event: DragMoveEvent,
  activeShip: IShip,
  settedShips: IShip[],
  activeClassName: string,
  setActiveClassName: (arg: string) => void
) => {
  if (!event.active.id) return;

  const { shipLocation, isHorizontal } = activeShip;

  const { deltaX, deltaY } = getActiveId(event?.delta?.x, event?.delta?.y);
  const newShipLocation = getNewShipLocation(shipLocation, deltaX, deltaY);
  const isCorrent = getIsCorrentDots(newShipLocation);
  const newShips = filteredShips(event.active.id, settedShips);

  const isCollisionBoard =
    newShipLocation.length > 1 &&
    isHorizontal &&
    getBoardCollisions(newShipLocation);

  if (!isCanDrop(newShips, newShipLocation) || !isCorrent || isCollisionBoard) {
    if (activeClassName !== "ship-red ") {
      setActiveClassName("ship-red ");
    }
  } else {
    if (activeClassName !== "ship-green") {
      setActiveClassName("ship-green");
    }
  }
};
