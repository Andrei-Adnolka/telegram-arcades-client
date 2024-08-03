import { FC, useEffect, memo, useState } from "react";
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
import { IShip, PERSON } from "../../types";

import Cell from "../cell";

import {
  usePersonContextData,
  useStateContextActions,
} from "../../../../context";

import { dragEnd, dragOver, dragStart } from "../../API";
import { findShip } from "../../helpers";

import "./index.scss";

type Props = {
  isRival: boolean;
  isOnline: boolean;
  isStarted: boolean;
  sendSocket: (shoot: number) => void;
};

const getStylePosition = (activeShip: IShip, activeId: string) => {
  if (!activeShip || !activeId) return {};

  const { isHorizontal, shipLocation } = activeShip;
  let position = 0;

  shipLocation.forEach((id, i) => {
    if (id.toString() === activeId) {
      position = i;
    }
  });

  if (isHorizontal) {
    if (position === 1) {
      return { left: "-32px" };
    }
    if (position === 2) {
      return { left: "-64px" };
    }
    if (position === 3) {
      return { left: "-96px" };
    }
    return { left: "0px" };
  } else {
    if (position === 1) {
      return { top: "-32px" };
    }
    if (position === 2) {
      return { top: "-64px" };
    }
    if (position === 3) {
      return { top: "-96px" };
    }
    return { top: "0px" };
  }
};

const Field: FC<Props> = ({ isRival, isOnline, isStarted, sendSocket }) => {
  const person = isRival ? PERSON.rival : PERSON.user;
  const personState = usePersonContextData(person);
  const { setRandomShips, addNewShips } = useStateContextActions();

  const [activeShip, setActiveShip] = useState({} as IShip);
  const [activeId, setActiveId] = useState("");

  const isAbleShoot = false; // check it propr

  useEffect(() => {
    setRandomShips();
  }, []);

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 0 },
    })
  );

  const bgClass = `battleground ${!isAbleShoot && isRival ? "inactive" : ""}`;

  const shootHandler = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!(e.target as HTMLDivElement).id) {
      return;
    }

    const shoot = Number((e.target as HTMLDivElement).id);
    if (isAbleShoot && isStarted && isRival) {
      const isMissAlready = personState.misses.includes(shoot);

      const isDeadAlready = personState.ships.some((ship) => {
        return ship.woundedCells.includes(shoot);
      });

      const isNotAllowed = personState.notAllowed.includes(shoot);

      if (isDeadAlready || isMissAlready || isNotAllowed) {
        return;
      }

      if (isOnline) {
        sendSocket(shoot);
      }
      // } else {
      //   userTurn(shoot);
      // }
    }
  };

  const dragOverHandler = (event: DragMoveEvent) => {
    dragOver(event, personState.ships);
  };

  const handleEnd = (ships: IShip[]) => {
    setActiveShip({} as IShip);
    addNewShips(ships);
    setActiveId("");
  };

  const dragStartHandler = (event: DragMoveEvent) => {
    const activeShip = findShip(Number(event.active.id), personState.ships);

    if (activeShip?.shipLocation) {
      dragStart(event, activeShip);
      setActiveShip(activeShip);
      setActiveId(event.active.id as string);
    }
  };

  const dragEndHandler = (event: DragMoveEvent) => {
    dragEnd(event, activeShip, personState.ships, handleEnd);
  };

  const idsList = FIELD.map((_, i) => i.toString());

  const stylePosition = getStylePosition(activeShip, activeId);

  return (
    <div className={bgClass} id="field">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={dragStartHandler}
        onDragMove={dragOverHandler}
        onDragEnd={dragEndHandler}
      >
        {idsList.map((id) => (
          <Cell
            key={id}
            id={id}
            coordinate={Number(id)}
            isRival={isRival}
            personState={personState}
          />
        ))}
        {activeShip?.shipLocation?.length ? (
          <DragOverlay dropAnimation={null}>
            <div
              style={{
                display: activeShip.isHorizontal ? "inline-flex" : "block",
                position: "absolute",
                ...stylePosition,
              }}
            >
              {activeShip.shipLocation.map((id) => {
                return (
                  <Cell
                    key={id}
                    id={id.toString()}
                    coordinate={id}
                    isRival={isRival}
                    personState={personState}
                  />
                );
              })}
            </div>
          </DragOverlay>
        ) : null}
      </DndContext>
      {/* {isRival && !isGameFinded && isOnline ? (
        <div className="connection">{t("fieldWait")}</div>
      ) : null}
      {opponentIsReady && !isStarted && isRival ? (
        <div className="connection">{t("fieldReady")}</div>
      ) : null} */}
    </div>
  );
};

export default memo(Field);
