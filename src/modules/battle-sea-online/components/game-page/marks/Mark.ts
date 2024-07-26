import { Cell } from "../models/cell";

export class Mark {
  logo: string | null;
  name: string;
  color: string | null;
  id: number;
  cell: Cell;

  constructor(cell: Cell) {
    this.cell = cell;
    this.cell.mark = this;
    this.logo = null;
    this.color = null;
    this.id = Math.random();
    this.name = "";
  }
}
