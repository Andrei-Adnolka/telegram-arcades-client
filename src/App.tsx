import Tetris from "./module/tetris";
import { Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";

function App() {
  const { pathname } = useLocation();
  const isLoadedGame = pathname !== "/";

  return (
    <div className="app">
      {isLoadedGame ? null : (
        <div className="home_page">
          <h2>MENU</h2>
          <a href="/tetris">TETRIS</a>
        </div>
      )}
      <Routes>
        <Route path="/tetris" element={<Tetris />} />
      </Routes>
    </div>
  );
}

export default App;
