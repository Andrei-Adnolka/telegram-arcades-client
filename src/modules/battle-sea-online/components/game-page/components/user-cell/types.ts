import { IPlayerState, IShip } from "../../types";

export interface ICell {
  coordinate: number;
  isRival?: boolean;
  misses: number[];
  notAllowed: number[];
  ships: IShip[];
  id: string;
}

export type TDnDHandler = (event: React.DragEvent<HTMLDivElement>) => void;
