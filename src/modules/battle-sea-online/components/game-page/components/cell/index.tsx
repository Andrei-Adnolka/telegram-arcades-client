import { FC } from "react";

import { Cell } from "../../models/cell";
import "./style.scss";

type Props = {
  cell: Cell;
  addMark: (position: number) => void;
};

const CellUI: FC<Props> = ({ cell, addMark }) => {
  const cellClasses = ["battle-cell"];
  cellClasses.push(cell?.mark?.color || ""); // mark style added fire

  return (
    <div
      className={cellClasses.join(" ")}
      onClick={() => addMark(cell.position)}
    >
      {cell?.mark?.name === "miss" ? (
        <div>&#183;</div>
      ) : (
        <span>{cell?.mark?.logo}</span>
      )}
    </div>
  );
};
export default CellUI;
