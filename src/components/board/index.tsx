import Cell from "../Cell";
import { BoardShape } from "../../types/tetris";

import "./style.scss";

interface Props {
  currentBoard: BoardShape;
  isPaused?: boolean;
}

function Board({ currentBoard, isPaused }: Props) {
  return (
    <div className={`board ${isPaused ? "paused" : ""}`}>
      {currentBoard.map((row, rowIndex) => (
        <div className="row" key={`${rowIndex}`}>
          {row.map((cell, colIndex) => (
            <Cell key={`${rowIndex}-${colIndex}`} type={cell} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Board;
