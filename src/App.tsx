import { Route, Routes, useLocation } from "react-router-dom";

import Tetris from "./modules/tetris";
import Snake from "./modules/snake";
import Arkanoid from "./modules/arkanoid";

function App() {
  const { pathname } = useLocation();
  const isLoadedGame = pathname !== "/";

  return (
    <div className="app">
      {isLoadedGame ? null : (
        <div className="home_page">
          <h1>BRICK GAMES</h1>
          <div className="home_page_links">
            <a href="/tetris">01 TETRIS</a>
            <a href="/snake">02 SNAKE</a>
            {/* <a href="/arkanoid">ARKANOID</a> */}
          </div>
        </div>
      )}
      <Routes>
        <Route path="/tetris" element={<Tetris />} />
        <Route path="/snake" element={<Snake />} />
        <Route path="/arkanoid" element={<Arkanoid />} />
      </Routes>
    </div>
  );
}

export default App;
