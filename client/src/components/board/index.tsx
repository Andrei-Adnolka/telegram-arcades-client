import Cell from "../Cell";
import { BoardShape } from "../../types";

import "./style.scss";

interface Props {
  currentBoard: BoardShape;
  isPaused?: boolean;
  isLeftFire?: boolean | null;
}

const getFireClassName = (isLeftFire?: boolean | null) => {
  if (typeof isLeftFire === "object" || typeof isLeftFire === "undefined")
    return { className: "", withDataName: false };
  return {
    className: isLeftFire ? "fire left_fire" : "fire right_fire",
    withDataName: true,
  };
};

function Board({ currentBoard, isPaused, isLeftFire }: Props) {
  const { className, withDataName } = getFireClassName(isLeftFire);
  return (
    <div className={`board ${isPaused ? "paused" : ""} ${className}`}>
      {currentBoard.map((row, rowIndex) => (
        <div className="row" key={`${rowIndex}`}>
          {row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              type={cell}
              dataName={withDataName ? `${rowIndex}-${colIndex}` : ""}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Board;
