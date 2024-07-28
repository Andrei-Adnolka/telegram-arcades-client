import { Mark } from "../marks/Mark";
import { Board } from "./board";

export class Cell {
  board: Board;
  position: number;
  mark: Mark | null;
  id: number;

  constructor(board: Board, position: number, mark: Mark | null) {
    this.position = position;
    this.board = board;
    this.mark = mark;
    this.id = position;
  }
}
