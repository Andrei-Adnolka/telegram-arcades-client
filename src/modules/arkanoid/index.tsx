import Board from "../../components/board-with-buttons";

import { useSpaceship } from "./hooks/useSpaceship";

const ArkanoidGame = () => {
  const data = useSpaceship();

  return <Board {...data} title="ARKANOID" />;
};

export default ArkanoidGame;
