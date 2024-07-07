import Board from "../../components/board-with-buttons";

import { useRace } from "./hooks/useRace";

const RaceGame = () => {
  const data = useRace();

  return <Board {...data} title="RACE" />;
};

export default RaceGame;
