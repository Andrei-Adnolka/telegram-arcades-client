import { DragEvent } from "react";
import { IShip } from "../../types";
import { DragMoveEvent } from "@dnd-kit/core";

export type IDragHandler = (event: DragMoveEvent, settedShips: IShip[]) => void;

export type IDropHandler = (
  event: DragMoveEvent,
  horizontalRotation: boolean,
  settedShips: IShip[],
  callback: (ship: IShip) => void,
  successfullyDrop: () => void
) => void;
