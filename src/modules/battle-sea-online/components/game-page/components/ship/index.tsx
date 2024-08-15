import { FC, memo, useMemo, useState } from "react";

import { DECKS } from "./_constants";

import { getOccupiedCells } from "../../helpers/ships";
import { isCanDrop } from "../../API";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { addShip, selectShips } from "../../../../redux/userSlice";
import { getNewShipLocation } from "./helpers";
import { getIsCorrentDots } from "../../API/DragAndDrop/helpers";

import "./index.scss";

type Props = {
  decks: number;
  id: string;
};

// function moveAt(pageX, pageY) {
//   ball.style.left = pageX - ball.offsetWidth / 2 + "px";
//   ball.style.top = pageY - ball.offsetHeight / 2 + "px";
// }

const removeClassList = (id: string) => {
  const element = document.getElementById(id)?.parentElement;
  element?.classList.remove("ship-red");
};

const getDeckClass = (decks: number) => {
  const { one, two, three, four } = DECKS;
  switch (decks) {
    case 1:
      return one;
    case 2:
      return two;
    case 3:
      return three;
    case 4:
      return four;
    default:
      return "";
  }
};

const Ship: FC<Props> = ({ decks, id }) => {
  const [activeId, setActiveId] = useState(0);
  const [shiftX, setShiftX] = useState(0);
  const [shiftY, setShiftY] = useState(0);
  const [drag, setDrag] = useState(false);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);

  const dispatch = useAppDispatch();
  const ships = useAppSelector(selectShips);

  const classList = ["ship", getDeckClass(decks)];

  function moveAt(pageX: number, pageY: number) {
    return {
      left: pageX - shiftX,
      top: pageY - shiftY,
    };
  }

  const onTouchStart = (e: TouchEvent) => {
    if (!(e?.target as HTMLDivElement)?.id) return;

    let { clientX, clientY, pageX, pageY } = e.changedTouches[0];
    const element = document.getElementById(id);
    if (element) {
      const rect = element.getBoundingClientRect();

      let shiftX = clientX - rect.left;
      let shiftY = clientY - rect.top;

      setShiftX(shiftX);
      setShiftY(shiftY);

      const at = moveAt(pageX - shiftX, pageY - shiftY);

      setTop(at.top);
      setLeft(at.left);
      setDrag(true);

      const position = (e.target as HTMLElement).id.split("_")[1];
      setActiveId(+position);
    }
  };

  const onTouchEnd = (e: TouchEvent) => {
    const point = e.changedTouches[0];

    if (point) {
      const { clientX, clientY } = point;
      const cells = document.elementsFromPoint(clientX, clientY);
      if (cells.length) {
        // @ts-ignore
        const p = +cells[2]?.id;
        if (typeof p === "number") {
          const shipLocation = getNewShipLocation(p, decks, activeId);

          if (!shipLocation?.length || !getIsCorrentDots(shipLocation)) {
            setActiveId(0);
            setDrag(false);
            removeClassList((e.target as HTMLElement).id);
            return;
          }
          if (!isCanDrop(ships, shipLocation)) {
            setActiveId(0);
            setDrag(false);
            removeClassList((e.target as HTMLElement).id);

            return;
          }

          const ship = {
            shipLocation,
            decks,
            occupiedCells: getOccupiedCells(shipLocation),
            woundedCells: [],
            isHorizontal: false,
          };

          dispatch(addShip(ship));
        }
      }
    }
    setActiveId(0);
    setDrag(false);
  };

  const onTouchMove = (e: TouchEvent) => {
    let { pageX, pageY, clientX, clientY } = e.changedTouches[0];
    const cells = document.elementsFromPoint(clientX, clientY);
    const p = +cells[2]?.id;
    const shipLocation = getNewShipLocation(p, decks, activeId);

    if (shipLocation && p) {
      const isCan =
        isCanDrop(ships, shipLocation) && getIsCorrentDots(shipLocation);

      if (e.target) {
        const element = document.getElementById(
          (e.target as HTMLElement).id
        )?.parentElement;

        if (element) {
          if (isCan) {
            element.classList.add("ship-green");
            element.classList.remove("ship-red");
          } else {
            element.classList.add("ship-red");
            element.classList.remove("ship-green");
          }
        } else {
        }
      }
    }

    const at = moveAt(pageX, pageY);
    setLeft(at.left);
    setTop(at.top);
  };

  const styles = useMemo(() => {
    return drag
      ? ({
          position: "fixed",
          top: `${top}px`,
          left: `${left}px`,
          zIndex: 11,
        } as React.CSSProperties)
      : {};
  }, [drag, top, left]);

  return (
    <>
      <div
        className={`${classList.join(" ")}`}
        id={id}
        // @ts-ignore
        onTouchStart={onTouchStart}
        // @ts-ignore
        onTouchMove={onTouchMove}
        // @ts-ignore
        onTouchEnd={onTouchEnd}
        style={styles}
      >
        {new Array(decks).fill(null).map((_, index) => (
          <div
            className="ship-cell"
            key={`${id}_${index}`}
            id={`${id}_${index}`}
          />
        ))}
      </div>
    </>
  );
};

export default memo(Ship);
