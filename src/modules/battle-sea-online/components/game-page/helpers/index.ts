import { getCorrectShip } from "../API/ShipsPlacer/ShipsPlacer";
import { SHIPS } from "../constants";
import { Board } from "../models/board";
import { IShip } from "../types";

export const getSendData = (
  event: string,
  payload: Record<string, string | number>
) => {
  return JSON.stringify({ event, payload });
};

export const changeBoardAfterShoot = (
  board: Board,
  setBoard: (board: Board) => void,
  position: number,
  isPerfectHit: boolean
) => {
  isPerfectHit ? board.addDamage(position) : board.addMiss(position);
  const newBoard = board.getCopyBoard();
  setBoard(newBoard);
};

export const findShip = (id: number, settedShips?: IShip[]) => {
  if (settedShips) {
    return settedShips.find((ship) => ship.shipLocation.includes(id));
  }
  return null;
};
