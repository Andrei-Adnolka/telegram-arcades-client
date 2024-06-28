import { Route, Routes, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

import Tetris from "./modules/tetris";
import Snake from "./modules/snake";
import Arkanoid from "./modules/arkanoid";

function App() {
  const { pathname } = useLocation();
  const isLoadedGame = pathname !== "/";
  const value = Cookies.get("exitPage");

  return (
    <div className="app">
      {isLoadedGame ? null : (
        <div className="home_page">
          <h2>MENU</h2>
          <a href="/tetris">TETRIS</a>
          <a href="/snake">SNAKE</a>
          <h2>{value}</h2>
          {/* <a href="/arkanoid">ARKANOID</a> */}
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
