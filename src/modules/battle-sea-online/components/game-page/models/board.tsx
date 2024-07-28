import { Damage } from "../marks/Damage";
import { Miss } from "../marks/Miss";
import { Ship } from "../marks/Ship";
import { Cell } from "./cell";

export class Board {
  cells = [] as Cell[];
  initCells() {
    for (let i = 0; i < 100; i++) {
      this.cells.push(new Cell(this, i, null));
    }
  }

  getCopyBoard() {
    const newBoard = new Board();
    newBoard.cells = this.cells;
    return newBoard;
  }
  getCells(position: number) {
    return this.cells[position];
  }
  // addShip(x: number, y: number) {
  //   new Ship(this.getCells(x, y));
  // }

  addFullShip(array: number[]) {
    array.forEach((part) => {
      new Ship(this.getCells(part));
    });
  }

  addMiss(position: number) {
    new Miss(this.getCells(position));
  }
  addDamage(position: number) {
    new Damage(this.getCells(position));
  }
}
