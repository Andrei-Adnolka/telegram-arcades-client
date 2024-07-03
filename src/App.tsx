import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import Tetris from "./modules/tetris";
import Snake from "./modules/snake";
import Arkanoid from "./modules/arkanoid";
import { AudioComponent } from "./components/audio";

function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isLoadedGame = pathname !== "/";

  return (
    <div className="app">
      {isLoadedGame ? (
        <div className="back_button_wrapper">
          <span className="back_button" onClick={() => navigate(-1)}>
            ←
          </span>
          <AudioComponent />
        </div>
      ) : (
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
