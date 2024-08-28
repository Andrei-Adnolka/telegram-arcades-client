import { memo } from "react";

import Cell from "../cell";
import { useAppSelector } from "../../redux/hooks";
import { selectBoard, selectIsGameOver } from "../../redux/gameSlice";

import "./index.scss";

const Field = () => {
  const board = useAppSelector(selectBoard);
  const isGameOver = useAppSelector(selectIsGameOver);

  return (
    <div className="block-blast-field" id="block-blast-field">
      {isGameOver ? (
        <div className="block-blast-game-over">
          Свободного места не осталось
        </div>
      ) : null}
      {board.map((row, rowIndex) => (
        <div
          className={`row ${isGameOver ? " inactive" : ""}`}
          key={`${rowIndex}`}
        >
          {row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              type={cell}
              dataName={`${rowIndex}-${colIndex}`}
              className="field-cell"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default memo(Field);
