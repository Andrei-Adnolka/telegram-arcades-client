import { DragMoveEvent } from "@dnd-kit/core";
import { IShip } from "../../types";
import { isCanDrop } from "../ShipsPlacer/isCanDrop";
import { getOccupiedCells } from "../ShipsPlacer/ShipsPlacer";
import {
  filteredShips,
  getActiveId,
  getBoardCollisions,
  getNewShipLocation,
} from "./helpers";

export const dragEnd = (
  event: DragMoveEvent,
  activeShip: IShip,
  settedShips: IShip[],
  addNewShips: (ships: IShip[]) => void
) => {
  if (!event?.active?.id || !activeShip?.shipLocation) return;
  const { shipLocation, isHorizontal } = activeShip;
  const parent = document.getElementById("field");

  if (parent) {
    shipLocation.forEach((el, i) => {
      parent.children[el].classList.remove("inactive");
    });
  }

  const { deltaX, deltaY, isVerticalDraggble } = getActiveId(
    event?.delta?.x,
    event?.delta?.y
  );

  const newShipLocation = getNewShipLocation(shipLocation, deltaX, deltaY);

  if (
    newShipLocation.length > 1 &&
    isHorizontal &&
    !isVerticalDraggble &&
    getBoardCollisions(newShipLocation)
  ) {
    return;
  }

  let isCorrent = true;

  newShipLocation.forEach((el) => {
    if (el > 99 || el < 0) {
      isCorrent = false;
    }
  });

  if (!isCorrent) return;

  const occupiedCells = getOccupiedCells(newShipLocation);
  const newShips = filteredShips(event.active.id, settedShips);

  if (!isCanDrop(newShips, newShipLocation)) {
    return;
  }

  const newShip = {
    ...activeShip,
    shipLocation: newShipLocation,
    occupiedCells,
  };

  newShips.push(newShip);
  addNewShips(newShips);
  return;
};
