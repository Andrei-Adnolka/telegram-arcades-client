import { Route, Routes, useLocation } from "react-router-dom";

import Tetris from "./modules/tetris";
import Snake from "./modules/snake";
import Arkanoid from "./modules/arkanoid";
import { LocationProvider } from "./provider/location";

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
          {/* <a href="/arkanoid">ARKANOID</a> */}
        </div>
      )}
      <LocationProvider>
        <Routes>
          <Route path="/tetris" element={<Tetris />} />
          <Route path="/snake" element={<Snake />} />
          <Route path="/arkanoid" element={<Arkanoid />} />
        </Routes>
      </LocationProvider>
    </div>
  );
}

export default App;
