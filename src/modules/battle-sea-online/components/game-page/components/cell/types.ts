import { IPlayerState } from "../../types";

export interface ICell {
  coordinate: number;
  isRival?: boolean;
  personState: IPlayerState;
  id: string;
}

export type TDnDHandler = (event: React.DragEvent<HTMLDivElement>) => void;
