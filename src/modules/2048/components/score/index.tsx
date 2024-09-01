import { useContext } from "react";

import { GameContext } from "../../context/game-context";

import "./style.scss";

export default function Score() {
  const { score } = useContext(GameContext);

  return (
    <div className="score">
      Score
      <div>{score}</div>
    </div>
  );
}
