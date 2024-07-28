// @ts-nocheck
import { SHIPS } from "../../constants";

export const isCanDrop = (settedShips: [], currentShip: number[]) => {
  return !settedShips.some((ship) => {
    return (
      currentShip.some((coordinate) => {
        return ship.occupiedCells.some((cell) => cell === coordinate);
      }) ||
      currentShip.some((coordinate) => {
        return ship.shipLocation.some((cell) => cell === coordinate);
      })
    );
  });
};

export const getRandomNum = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const getShipOrientation = () => !(getRandomNum(0, 1) === 1);

const notAvailableIndexesRight = [9, 19, 29, 39, 49, 59, 69, 79, 89, 99];
const notAvailableIndexesLeft = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];

export const getOccupiedCells = (ship: number[]) => {
  const sortedShip = [...ship].sort((a, b) => a - b);
  const length = sortedShip.length;
  const startPosition = sortedShip[0];
  const lastPosition = sortedShip[length - 1];
  const isHorizontal = sortedShip[0] + 1 == sortedShip[1] ? true : false;
  const occupiedCells: number[] = [];

  if (isHorizontal) {
    if (startPosition > 9) {
      sortedShip.forEach((id) => occupiedCells.push(id - 10));
      if (!notAvailableIndexesLeft.includes(startPosition)) {
        occupiedCells.push(startPosition - 11);
      }
      if (!notAvailableIndexesRight.includes(startPosition + length - 1)) {
        occupiedCells.push(startPosition + length - 10);
      }
    }
    if (startPosition <= 89) {
      sortedShip.forEach((id) => occupiedCells.push(id + 10));
      if (!notAvailableIndexesLeft.includes(startPosition)) {
        occupiedCells.push(startPosition + 9);
      }
      if (!notAvailableIndexesRight.includes(startPosition + length - 1)) {
        occupiedCells.push(startPosition + length + 10);
      }
    }
    if (!notAvailableIndexesLeft.includes(startPosition)) {
      occupiedCells.push(startPosition - 1);
    }
    if (!notAvailableIndexesRight.includes(startPosition + length - 1)) {
      occupiedCells.push(startPosition + length);
    }
  } else {
    if (startPosition > 9) {
      occupiedCells.push(startPosition - 10);
    }
    if (lastPosition <= 89) {
      occupiedCells.push(lastPosition + 10);
    }
    if (!notAvailableIndexesLeft.includes(startPosition)) {
      sortedShip.forEach((id) => occupiedCells.push(id - 1));
      if (startPosition > 9) {
        occupiedCells.push(startPosition - 11);
      }
      if (lastPosition <= 89) {
        occupiedCells.push(lastPosition + 9);
      }
    }
    if (!notAvailableIndexesRight.includes(startPosition)) {
      sortedShip.forEach((id) => occupiedCells.push(id + 1));
      if (startPosition > 9) {
        occupiedCells.push(startPosition - 9);
      }
      if (lastPosition <= 89) {
        occupiedCells.push(lastPosition + 11);
      }
    }
  }
  return occupiedCells;
};

export const checkPosition = (ship: number[], cellsList: number[]) => {
  const shipCells = [...ship];
  shipCells.push(...getOccupiedCells(ship));
  return shipCells.every((cell) => !cellsList.includes(cell));
};

export const getCorrectShip = (settedShips: [], newShips: [], ship: number) => {
  const isHorizontal = getShipOrientation();
  const randomShip = getShip(ship, isHorizontal);
  if (isCanDrop(settedShips, randomShip) && isCanDrop(newShips, randomShip)) {
    const occupiedCells = getOccupiedCells(randomShip);
    newShips.push({
      shipLocation: randomShip,
      decks: ship,
      occupiedCells: occupiedCells,
      woundedCells: [],
    });
  } else {
    getCorrectShip(settedShips, newShips, ship);
  }
};

export const getShip = (length: number, isHorizontal: boolean) => {
  let maxIndex = 99;
  let startPosition = 0;

  switch (isHorizontal) {
    case true:
      maxIndex -= length - 1;
      const getStartPosition = () => {
        startPosition = getRandomNum(0, maxIndex);
        if (
          Math.floor(startPosition / 10) !==
          Math.floor((startPosition + length - 1) / 10)
        ) {
          getStartPosition();
        }
        return startPosition;
      };
      startPosition = getStartPosition();
      break;
    case false:
      maxIndex -= (length - 1) * 10;
      startPosition = getRandomNum(0, maxIndex);
  }

  return new Array(length).fill(0).map((_, index) => {
    const i = isHorizontal ? 1 * index : 10 * index;
    return startPosition + i;
  });
};

type Ship = {
  shipLocation: number[];
  decks: number;
  occupiedCells: number[];
  woundedCells: [];
};

export const getRandomShips = () => {
  // const settedShips = [...state[person].ships];
  const settedShips = [];
  const newShips = [] as Ship[];
  SHIPS.forEach((ship) => {
    getCorrectShip(settedShips, newShips, ship);
  });
  return newShips;
};
