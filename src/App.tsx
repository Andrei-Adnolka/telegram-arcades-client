import { Route, Routes, useLocation } from "react-router-dom";

import Tetris from "./modules/tetris";
import Snake from "./modules/snake";
import Arkanoid from "./modules/arkanoid";
import Race from "./modules/race";
import Shot from "./modules/shot";

import { AudioComponent } from "./components/audio";
import { useBackButton } from "./hooks/useBackButton";

function App() {
  const { pathname } = useLocation();

  const isLoadedGame = pathname !== "/";

  useBackButton();

  return (
    <div className="app">
      {isLoadedGame ? (
        <div className="back_button_wrapper">
          <AudioComponent />
        </div>
      ) : (
        <div className="home_page">
          <h1>BRICK GAMES</h1>
          <div className="home_page_links">
            <a href="/tetris">01 TETRIS</a>
            <a href="/snake">02 SNAKE</a>
            <a href="/race">03 RACE</a>
            <a href="/shot">04 SHOT</a>
            <a href="/arkanoid">05 ARKANOID</a>
          </div>
        </div>
      )}
      <Routes>
        <Route path="/tetris" element={<Tetris />} />
        <Route path="/snake" element={<Snake />} />
        <Route path="/arkanoid" element={<Arkanoid />} />
        <Route path="/race" element={<Race />} />
        <Route path="/shot" element={<Shot />} />
      </Routes>
    </div>
  );
}

export default App;
