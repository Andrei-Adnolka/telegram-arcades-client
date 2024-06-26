import { Route, Routes, useLocation } from "react-router-dom";

import Tetris from "./modules/tetris";
import Snake from "./modules/snake";

function App() {
  const { pathname } = useLocation();
  const isLoadedGame = pathname !== "/";

  return (
    <div className="app">
      {isLoadedGame ? null : (
        <div className="home_page">
          <h2>MENU</h2>
          <a href="/tetris">TETRIS</a>
          <a href="/snake">SNAKE</a>
        </div>
      )}
      <Routes>
        <Route path="/tetris" element={<Tetris />} />
        <Route path="/snake" element={<Snake />} />
      </Routes>
    </div>
  );
}

export default App;
