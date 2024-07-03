import { memo } from "react";
import Board from "../../components/board-with-buttons";

import { useSnake } from "./hooks/useSnake";

const SnakeGame = () => {
  const data = useSnake();

  return <Board {...data} title="SNAKE" />;
};

export default memo(SnakeGame);
