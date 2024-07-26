import { Route, Routes, useLocation } from "react-router-dom";

import Tetris from "./modules/tetris";
import Snake from "./modules/snake";
import Arkanoid from "./modules/arkanoid";
import Race from "./modules/race";
import Shot from "./modules/shot";
import FlappyBird from "./modules/flappy-bird";
import BattleSea from "./modules/battle-sea-online";

import { AudioComponent } from "./components/audio";
import { useBackButton } from "./hooks/useBackButton";

function App() {
  const { pathname } = useLocation();

  const isLoadedGame = pathname !== "/";
  const isShowSound = pathname === "/tetris";

  useBackButton();

  return (
    <div className="app">
      {isLoadedGame && isShowSound ? (
        <div className="back_button_wrapper">
          <AudioComponent />
        </div>
      ) : null}
      {isLoadedGame ? null : (
        <div className="home_page">
          <div>
            <h1>BRICK GAMES</h1>
            <div className="home_page_links">
              <a href="/tetris">01 TETRIS</a>
              <a href="/snake">02 SNAKE</a>
              <a href="/race">03 RACE</a>
              <a href="/shot">04 SHOT</a>
              <a href="/arkanoid">05 ARKANOID</a>
            </div>
          </div>
          <div>
            <h1>CLASSIC GAMES</h1>
            <div className="home_page_links">
              <a href="/flappy">01 FLAPPY BIRD</a>
            </div>
          </div>
        </div>
      )}
      <Routes>
        <Route path="/tetris" element={<Tetris />} />
        <Route path="/snake" element={<Snake />} />
        <Route path="/arkanoid" element={<Arkanoid />} />
        <Route path="/race" element={<Race />} />
        <Route path="/shot" element={<Shot />} />
        <Route path="/flappy" element={<FlappyBird />} />
        <Route path="/battle-sea-online" element={<BattleSea />}>
          <Route path=":gameId" />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
