import { Route, Routes, useLocation, useBeforeUnload } from "react-router-dom";

import Tetris from "./modules/tetris";
import Snake from "./modules/snake";
import Arkanoid from "./modules/arkanoid";

const NAME = "app-storge";

function App() {
  const { pathname } = useLocation();
  const isLoadedGame = pathname !== "/";
  const Hello = window.localStorage.getItem(NAME);

  useBeforeUnload(() => {
    window.localStorage.setItem(NAME, "hello");
  });

  return (
    <div className="app">
      {isLoadedGame ? null : (
        <div className="home_page">
          <h2>MENU</h2>
          <a href="/tetris">TETRIS</a>
          <a href="/snake">SNAKE</a>
          <div>{Hello}</div>
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
