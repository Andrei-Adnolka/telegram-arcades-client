import { UniqueIdentifier } from "@dnd-kit/core";
import { IShip } from "../../../types";

const right = [9, 19, 29, 39, 49, 59, 69, 79, 89, 99];
const left = [10, 20, 30, 40, 50, 60, 70, 80, 90];

export const filteredShips = (id: UniqueIdentifier, settedShips: IShip[]) => {
  return settedShips.filter((ship) => {
    return !ship.shipLocation.includes(Number(id));
  });
};

const DEFAULT_RETURN = { deltaY: 0, deltaX: 0, isVerticalDraggble: false };

export const getBoardCollisions = (ship: number[]) => {
  let isLeft = false;
  let isRight = false;

  ship.forEach((s, i) => {
    if (right.includes(s) && i !== ship.length - 1) {
      isRight = true;
    }
    if (left.includes(s) && i !== 0) {
      isLeft = true;
    }
  });

  return isRight || isLeft;
};

export const getNewShipLocation = (
  shipLocation: number[],
  deltaX: number,
  deltaY: number
) => {
  return shipLocation.map((ship) => {
    let newValue = ship;
    if (deltaX) newValue = newValue + deltaX;
    if (deltaY) newValue = newValue + deltaY;
    return newValue;
  });
};

export const getActiveId = (x: number, y: number) => {
  if (typeof x !== "number" || typeof y !== "number") return DEFAULT_RETURN;

  const posx = Math.sign(x);
  const posy = Math.sign(y);

  if (posx === 0 && posy === 0) {
    return DEFAULT_RETURN;
  }

  const positionX = posx * Math.round((x * posx) / 30);
  const positionY = posy * Math.round((y * posy) / 30) * 10;

  const isVerticalDraggble = !positionX && positionY !== 0;

  return { deltaX: positionX, deltaY: positionY, isVerticalDraggble };
};
