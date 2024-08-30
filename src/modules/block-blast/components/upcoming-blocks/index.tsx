import { FC, useState } from "react";
import trottle from "lodash.throttle";

import { Block, BlockShape } from "../../types";

import { useCommitPosition } from "../../hooks/useCommitPosition";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  selectBlocks,
  selectIsGameOver,
  updatedBlocks,
} from "../../redux/gameSlice";
import { getNewBlockIds } from "../../hooks/helpers";

import "./style.scss";
import { useTelegram } from "../../../../provider/telegram";
import isEqual from "lodash.isequal";

type BlockProps = {
  block: Block;
  shape: BlockShape;
  index: number;
  id: string;
  updatedBlocks: (arg: number) => void;
  commitPosition: (
    block: Block,
    shape: BlockShape,
    row: number,
    column: number
  ) => boolean;
};

const getPoint = (cells: any[]) => {
  let point = null;
  if (cells.length) {
    point = cells.find((cell) => cell.classList.contains("field-cell"));
  }
  return point;
};

//@ts-ignore
const isCanDrop = (el) => !!el.classList.contains("Empty");

const BlockUI: FC<BlockProps> = ({
  block,
  shape,
  index,
  id,
  updatedBlocks,
  commitPosition,
}) => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [isLeft, setIsLeft] = useState(false);
  const [isTop, setIsTop] = useState(false);

  const { webApp } = useTelegram();
  const isGameOver = useAppSelector(selectIsGameOver);

  const onStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (isGameOver) return;

    let { clientX, clientY } = e.changedTouches[0];
    const moving = e.currentTarget;
    setX(clientX);
    setY(clientY);
    if (moving) {
      moving.style.position = "fixed";
      moving.style.left = `${clientX - moving.clientWidth / 2}px`;
      moving.style.top = `${clientY - moving.clientHeight / 2 - 48}px`;
      moving.classList.add("full-size");
    }
    webApp?.HapticFeedback?.impactOccurred?.("soft");
  };

  const getCells = (
    mobingLeft: string,
    movingTop: string,
    left: number,
    top: number
  ) => {
    return document.elementsFromPoint(
      Math.round(+mobingLeft.replace("px", "") + left),
      Math.round(+movingTop.replace("px", "") + top)
    );
  };

  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();

    let { clientX, clientY } = e.changedTouches[0];
    const isTop = y > clientY;
    const isLeft = x >= clientX;

    setIsTop(isTop);
    setIsLeft(isLeft);
    setX(clientX);
    setY(clientY);

    const moving = e.currentTarget;
    if (!moving?.style) return;

    if (moving) {
      moving.style.position = "fixed";
      moving.style.left = `${clientX - moving.clientWidth / 2}px`;
      moving.style.top = `${clientY - moving.clientHeight / 2 - 48}px`;
      moving.classList.add("full-size");
      const left = isLeft ? 10 : 30;
      const top = isTop ? 10 : 30;
      const cells = getCells(moving.style.left, moving.style.top, left, top);
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
          }
        });
      }
    }
  };

  const onTouchTrottle = trottle((e) => onTouchMove(e), 5);

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = (e) => {
    const moving = e.currentTarget;

    if (moving) {
      const left = isLeft ? 10 : 30;
      const top = isTop ? 10 : 30;
      const cells = getCells(moving.style.left, moving.style.top, left, top);

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
            if (isCorrect) {
              updatedBlocks(index);
            }
          }
        }
      }
      moving.classList.remove("full-size");
    }

    if (moving) {
      moving.style.left = "";
      moving.style.top = "";
      moving.style.height = "";
      moving.style.width = "";
      moving.style.position = "";
    }
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
    </>
  );
};

const UpcomingBlocks = () => {
  const blocks = useAppSelector(selectBlocks, isEqual);
  const dispatch = useAppDispatch();
  const { commitPosition } = useCommitPosition();

  const onUpdated = (index: number) => {
    dispatch(updatedBlocks(index));
  };

  return (
    <div className="block-blast-upcoming-blocks">
      {blocks.map((b, i) => {
        const id = `${b.block}_${i}`;
        if (b.block === ("empty" as Block)) {
          return <div className="empty-block" key={id} />;
        }

        return (
          <BlockUI
            block={b.block}
            shape={b.shape}
            index={i}
            key={id}
            id={id}
            updatedBlocks={onUpdated}
            commitPosition={commitPosition}
          />
        );
      })}
    </div>
  );
};

export default UpcomingBlocks;
