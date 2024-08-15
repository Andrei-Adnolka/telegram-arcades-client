import { findShip } from ".";
import { IShip } from "../types";
import {
  filteredShips,
  getBoardCollisions,
  getIsCorrentDots,
} from "../API/DragAndDrop/helpers";
import { isCanDrop } from "../API/ShipsPlacer/isCanDrop";
import { getOccupiedCells } from "../API/ShipsPlacer/ShipsPlacer";

export const rotateShip = (
  id: string,
  ships: IShip[],
  addNewShips: (arg: IShip[]) => void
) => {
  const activeShip = findShip(Number(id), ships);
  if (!activeShip) return;
  const { isHorizontal, shipLocation } = activeShip || ({} as IShip);
  let newShipLocation = [...shipLocation];
  const headrShip = shipLocation[0];

  if (isHorizontal) {
    newShipLocation = newShipLocation.map((_, i) => {
      return headrShip + i * 10;
    });
  } else {
    newShipLocation = newShipLocation.map((_, i) => {
      return headrShip + i;
    });
  }

  const isCollisionBoard =
    newShipLocation.length > 1 &&
    !isHorizontal &&
    getBoardCollisions(newShipLocation);

  const isCorrent = getIsCorrentDots(newShipLocation);
  const newShips = filteredShips(id, ships);

  if (!isCanDrop(newShips, newShipLocation) || !isCorrent || isCollisionBoard) {
    const parent = document.getElementById("user-field");
    if (parent) {
      shipLocation.forEach((el) => {
        parent.children[el]?.classList?.add?.("cell-red");
      });
      setTimeout(() => {
        shipLocation.forEach((el) => {
          parent.children[el]?.classList?.remove?.("cell-red");
        });
      }, 500);
    }
  } else {
    const newShip = {
      ...activeShip,
      shipLocation: newShipLocation,
      occupiedCells: getOccupiedCells(newShipLocation),
      isHorizontal: !isHorizontal,
    } as IShip;

    newShips.push(newShip);
    addNewShips(newShips);
  }
};
