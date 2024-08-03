import { memo, useEffect } from "react";
import { useParams } from "react-router-dom";

import Login from "./components/authorization";
import GamePage from "./components/game-page";
import { СontextProvider } from "./context";

import "./style.scss";

const BattleSea = () => {
  const { gameId } = useParams();

  useEffect(() => {
    const root = document.getElementById("root");
    if (root?.style) {
      root.style.backgroundColor = "white";
    }
  }, []);

  return (
    <СontextProvider>
      <div className="battle_sea_wrapper">
        {gameId ? <GamePage /> : <Login />}
      </div>
    </СontextProvider>
  );
};

export default memo(BattleSea);
