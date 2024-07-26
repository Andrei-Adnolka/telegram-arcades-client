import { Cell } from "../models/cell";
import { Mark } from "./Mark";

export class Ship extends Mark {
  constructor(cell: Cell) {
    super(cell);
    this.logo = null;
    this.name = "ship";
    this.color = "grey";
  }
}
