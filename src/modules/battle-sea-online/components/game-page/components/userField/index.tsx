import { useEffect, memo, useState } from "react";
import {
  closestCenter,
  DndContext,
  DragMoveEvent,
  DragOverlay,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { FIELD } from "../../constants";
import { IShip } from "../../types";

import Cell from "../user-cell";

import { dragEnd, dragOver, dragStart } from "../../API";
import { findShip } from "../../helpers";
import ShipStation from "../shipStation";

import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
  addNewShips,
  setRandomShips,
  selectShips,
} from "../../../../redux/userSlice";
import "./index.scss";

const getStylePosition = (activeShip: IShip, activeId: string) => {
  if (!activeShip || !activeId) return {};

  const { isHorizontal, shipLocation } = activeShip;
  let position = 0;

  shipLocation.forEach((id, i) => {
    if (id.toString() === activeId) {
      position = i;
    }
  });
  return { [isHorizontal ? "left" : "top"]: `-${32 * position}px` };
};

const UserField = () => {
  const ships = useAppSelector(selectShips);
  const dispatch = useAppDispatch();

  const [activeShip, setActiveShip] = useState({} as IShip);
  const [activeId, setActiveId] = useState("");
  const [activeClassName, setActiveClassName] = useState("");

  useEffect(() => {
    dispatch(setRandomShips());
    // eslint-disable-next-line
  }, []);

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 0 },
    })
  );

  const dragOverHandler = (event: DragMoveEvent) => {
    dragOver(event, activeShip, ships, activeClassName, setActiveClassName);
  };

  const handleEnd = (s: IShip[]) => {
    setActiveShip({} as IShip);
    dispatch(addNewShips(s));
    setActiveId("");
    setActiveClassName("");
  };

  const dragStartHandler = (event: DragMoveEvent) => {
    const activeShip = findShip(Number(event.active.id), ships);
    if (activeShip?.shipLocation) {
      dragStart(event, activeShip);
      setActiveShip(activeShip);
      setActiveId(event.active.id as string);
    }
  };

  const dragEndHandler = (event: DragMoveEvent) => {
    dragEnd(event, activeShip, ships, handleEnd);
  };

  const idsList = FIELD.map((_, i) => i.toString());
  const stylePosition = getStylePosition(activeShip, activeId);

  return (
    <>
      <div className="battleground" id="user-field">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={dragStartHandler}
          onDragMove={dragOverHandler}
          onDragEnd={dragEndHandler}
        >
          {idsList.map((id) => (
            <Cell key={id} id={id} coordinate={Number(id)} ships={ships} />
          ))}
          {activeShip?.shipLocation?.length ? (
            <DragOverlay dropAnimation={null}>
              <div
                style={{
                  display: activeShip.isHorizontal ? "inline-flex" : "block",
                  position: "absolute",
                  ...stylePosition,
                }}
                className={activeClassName}
              >
                {activeShip.shipLocation.map((id) => (
                  <Cell
                    key={id}
                    id={id.toString()}
                    coordinate={Number(id)}
                    ships={ships}
                  />
                ))}
              </div>
            </DragOverlay>
          ) : null}
        </DndContext>
      </div>
      <ShipStation />
    </>
  );
};

export default memo(UserField);