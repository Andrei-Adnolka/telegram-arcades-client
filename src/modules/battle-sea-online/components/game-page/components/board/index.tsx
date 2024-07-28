import { FC, Fragment } from "react";
import CellUI from "../cell";

import { Board } from "../../models/board";

import "./style.scss";

type Props = {
  board: Board;
  setBoard: (board: Board) => void;
  shipsReady?: boolean;
  isMyBoard?: boolean;
  canShoot: boolean;
  shoot?: (position: number) => void;
};

const BoardUI: FC<Props> = ({
  board,
  setBoard,
  shipsReady,
  isMyBoard,
  canShoot,
  shoot,
}) => {
  const boardClasses = ["battle-board"];

  const addMark = (position: number) => {
    if (canShoot && !isMyBoard && shipsReady) {
      shoot?.(position);
    }
    updatedBoard();
  };

  const updatedBoard = () => {
    const newBoard = board.getCopyBoard();
    setBoard(newBoard);
  };

  if (canShoot) {
    boardClasses.push("active-shoot");
  }

  return (
    <div className={boardClasses.join(" ")}>
      {board.cells.map((cell, index) => {
        return (
          <Fragment key={index}>
            <CellUI key={cell.id} cell={cell} addMark={addMark} />
          </Fragment>
        );
      })}
    </div>
  );
};
export default BoardUI;
