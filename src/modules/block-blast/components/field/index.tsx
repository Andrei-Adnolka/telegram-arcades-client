import { memo } from "react";

import Cell from "../cell";

import "./index.scss";
import { useAppSelector } from "../../redux/hooks";
import { selectBoard } from "../../redux/gameSlice";

const Field = () => {
  const board = useAppSelector(selectBoard);

  return (
    <div className="block-blast-field" id="block-blast-field">
      {board.map((row, rowIndex) => (
        <div className="row" key={`${rowIndex}`}>
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
