import { memo } from "react";
import Board from "../../components/board-with-buttons";

import { useTetris } from "./hooks/useTetris";

const TetrisGame = () => {
  const data = useTetris();

  return <Board {...data} title="TETRIS" isShowUpcomingsBlocks />;
};

export default memo(TetrisGame);
