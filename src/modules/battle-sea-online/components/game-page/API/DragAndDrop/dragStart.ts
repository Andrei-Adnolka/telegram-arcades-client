import { DragMoveEvent } from "@dnd-kit/core";

import { IShip } from "../../types";

export const dragStart = (event: DragMoveEvent, activeShip: IShip) => {
  if (!event.active.id || !activeShip?.shipLocation) return;
  const { shipLocation } = activeShip;
  const parent = document.getElementById("field");
  if (parent) {
    shipLocation.forEach((el) => {
      parent.children[el]?.classList?.add?.("inactive");
    });
  }
};
