import { Board } from "../models/board";

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
