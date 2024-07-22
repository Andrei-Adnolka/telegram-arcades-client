import Board from "../../components/board-with-buttons";

import { useShot } from "./hooks/useShot";

const ShotGame = () => {
  const data = useShot();

  return <Board {...data} title="SHOT" />;
};

export default ShotGame;
