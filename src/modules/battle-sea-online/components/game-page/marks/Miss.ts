import { Cell } from "../models/cell";
import { Mark } from "./Mark";

export class Miss extends Mark {
  constructor(cell: Cell) {
    super(cell);
    this.logo = null;
    this.name = "miss";
    this.color = "blue";
  }
}
