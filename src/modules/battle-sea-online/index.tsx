import { memo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Provider } from "react-redux";

import Login from "./components/authorization";
import GamePage from "./components/game-page";

import { store } from "./redux/store";

import "./style.scss";

const BattleSea = () => {
  const { gameId } = useParams();

  useEffect(() => {
    const root = document.getElementById("root");
    const body = document.querySelector("body");

    if (root?.style) {
      root.style.backgroundColor = "white";
    }
    if (body?.style) {
      body.style.background = "white";
      document.body.style.overflow = "hidden";
      window.scrollTo({ top: 0 });
    }
  }, []);

  return (
    <Provider store={store}>
      <div className="battle_sea_wrapper" id="battleships-wrapper">
        {gameId ? <GamePage gameId={gameId} /> : <Login />}
      </div>
    </Provider>
  );
};

export default memo(BattleSea);
