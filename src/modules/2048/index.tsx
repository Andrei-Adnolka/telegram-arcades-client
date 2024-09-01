import Board from "./components/board";
import Score from "./components/score";
import NewGameUI from "./components/new-game-button";

import GameProvider from "./context/game-context";

import "./style.scss";

export default function Home() {
  return (
    <GameProvider>
      <div className="twenty48">
        <header>
          <h1>2048</h1>
          <div>
            <Score />
            <NewGameUI />
          </div>
        </header>
        <main>
          <Board />
        </main>
      </div>
    </GameProvider>
  );
}
