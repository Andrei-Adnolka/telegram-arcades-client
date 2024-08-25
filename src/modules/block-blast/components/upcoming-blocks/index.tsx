import { FC, useState } from "react";
import trottle from "lodash.throttle";

import { SHAPES } from "../../constants";
import { Block } from "../../types";

import { useCommitPosition } from "../../hooks/useCommitPosition";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectBlocks, updatedBlocks } from "../../redux/gameSlice";
import { getNewBlockIds } from "../../hooks/helpers";

import "./style.scss";

type BlockProps = {
  block: Block;
  index: number;
  id: string;
  updatedBlocks: (arg: number) => void;
};

const getPoint = (cells: any[]) => {
  let point = null;
  if (cells.length) {
    point = cells.find((cell) => cell.classList.contains("field-cell"));
  }
  return point;
};
const getShape = (block: Block) =>
  SHAPES[block].shape.filter((row) => row.some((cell) => cell));

//@ts-ignore
const isCanDrop = (el) => {
  //@ts-ignore
  if (el.classList.contains("Empty")) {
    return true;
  } else {
    return false;
  }
};

const BlockUI: FC<BlockProps> = ({ block, index, id, updatedBlocks }) => {
  const shape = getShape(block);
  const [isDrag, setIsDrag] = useState(false);
  const { commitPosition } = useCommitPosition();

  const onStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    let { clientX, clientY } = e.changedTouches[0];
    const moving = e.currentTarget;

    if (moving) {
      moving.style.position = "fixed";
      moving.style.left = `${clientX - moving.clientWidth / 2}px`;
      moving.style.top = `${clientY - moving.clientHeight / 2 - 48}px`;
      moving.classList.add("full-size");

      setIsDrag(true);
    }
  };

  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    let { clientX, clientY } = e.changedTouches[0];
    const moving = e.currentTarget;
    if (!moving?.style) return;

    if (moving) {
      moving.style.position = "fixed";
      moving.style.left = `${clientX - moving.clientWidth / 2}px`;
      moving.style.top = `${clientY - moving.clientHeight / 2 - 48}px`;
      moving.classList.add("full-size");

      const cells = document.elementsFromPoint(
        Math.round(+moving.style.left.replace("px", "")),
        Math.round(+moving.style.top.replace("px", ""))
      );

      const point = getPoint(cells);
      const getAllBoardCells = document.querySelectorAll(".field-cell.Empty");

      if (point?.id) {
        const [row, column] = point.id.split("-");
        if (row && column) {
          const ids = getNewBlockIds(shape, +row, +column);

          let isCan = true;
          if (ids.length) {
            ids.forEach((id) => {
              const element = document.getElementById(id);

              if (isCan) {
                isCan = !!element && isCanDrop(element);
              }
            });
          }
          getAllBoardCells.forEach((cell) => {
            const element = document.getElementById(cell.id);
            if (element) {
              if (isCan && ids.includes(cell.id)) {
                element.classList.add("correct-element");
              } else {
                element.classList.remove("correct-element");
              }
            }
          });
        }
      } else {
        getAllBoardCells.forEach((cell) => {
          const element = document.getElementById(cell.id);
          if (element) {
            element.classList.remove("correct-element");
            moving.classList.remove("full-size");
          }
        });
      }
    }
  };

  const onTouchTrottle = trottle((e) => onTouchMove(e), 10);

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = (e) => {
    const moving = e.currentTarget;

    if (moving) {
      const cells = document.elementsFromPoint(
        Math.round(+moving.style.left.replace("px", "")),
        Math.round(+moving.style.top.replace("px", ""))
      );

      if (cells.length) {
        const point = getPoint(cells);

        if (point?.id) {
          const [row, column] = point.id.split("-");
          if (row && column) {
            const ids = getNewBlockIds(shape, +row, +column);
            const isCorrect = commitPosition(block, shape, +row, +column);

            ids.forEach((id) => {
              const element = document.getElementById(id);
              if (element) {
                element.classList.remove("correct-element");
              }
            });
            moving.classList.remove("full-size");
            if (isCorrect) {
              updatedBlocks(index);
            }
          }
        }
      }
    }

    if (moving) {
      moving.style.left = "";
      moving.style.top = "";
      moving.style.height = "";
      moving.style.width = "";
      moving.style.position = "";
    }
    setIsDrag(false);
  };

  return (
    <>
      <div
        id={id}
        onTouchStart={onStart}
        onTouchMove={onTouchTrottle}
        onTouchEnd={onTouchEnd}
      >
        {shape.map((row, rowIndex) => {
          return (
            <div key={rowIndex} className="block-row">
              {row.map((isSet, cellIndex) => {
                const cellClass = isSet ? block : "hidden";
                return (
                  <div
                    key={`${index}-${rowIndex}-${cellIndex}`}
                    className={`blast-cell ${cellClass}`}
                  ></div>
                );
              })}
            </div>
          );
        })}
      </div>
      {isDrag ? (
        <div className="empty-block" key={`${id}_empty-block`} />
      ) : null}
    </>
  );
};

const UpcomingBlocks = () => {
  const blocks = useAppSelector(selectBlocks);
  const dispatch = useAppDispatch();

  const onUpdated = (index: number) => {
    dispatch(updatedBlocks(index));
  };

  return (
    <div className="block-blast-upcoming-blocks">
      {blocks.map((b, i) => {
        const id = `${b}_${i}`;
        if (b === ("empty" as Block)) {
          return <div className="empty-block" key={id} />;
        }

        return (
          <BlockUI
            block={b}
            index={i}
            key={id}
            id={id}
            updatedBlocks={onUpdated}
          />
        );
      })}
    </div>
  );
};

export default UpcomingBlocks;
