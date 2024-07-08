import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import Tetris from "./modules/tetris";
import Snake from "./modules/snake";
import Arkanoid from "./modules/arkanoid";
import Race from "./modules/race";
import { AudioComponent } from "./components/audio";
import { useTelegram } from "./provider/telegram";

function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isLoadedGame = pathname !== "/";

  const { webApp } = useTelegram();

  useEffect(() => {
    const callback = () => navigate(-1);
    if (webApp) {
      if (isLoadedGame) {
        webApp.BackButton.isVisible = true;
        webApp.onEvent("backButtonClicked", callback);
      } else {
        webApp.BackButton.isVisible = false;
      }
    }
    return () => webApp && webApp.offEvent("backButtonClicked", callback);
  }, [isLoadedGame, webApp, navigate]);

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
            {/* <a href="/arkanoid">ARKANOID</a> */}
          </div>
        </div>
      )}
      <Routes>
        <Route path="/tetris" element={<Tetris />} />
        <Route path="/snake" element={<Snake />} />
        <Route path="/arkanoid" element={<Arkanoid />} />
        <Route path="/race" element={<Race />} />
      </Routes>
    </div>
  );
}

export default App;
