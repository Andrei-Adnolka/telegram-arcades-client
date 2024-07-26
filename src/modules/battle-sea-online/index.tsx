import { memo } from "react";
import { useParams } from "react-router-dom";

import Login from "./components/authorization";
import GamePage from "./components/game-page";

import "./style.scss";

const BattleSea = () => {
  const { gameId } = useParams();

  return (
    <div className="battle_sea_wrapper">
      {gameId ? <GamePage /> : <Login />}
    </div>
  );
};

export default memo(BattleSea);
