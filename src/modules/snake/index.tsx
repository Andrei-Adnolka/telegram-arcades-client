import Board from "../../components/board";
import ButtonsUI from "../../components/buttons";
import { PauseSvg } from "../../svg/pause";
import { ContinueSvg } from "../../svg/continue";

import { useSnake } from "./hooks/useSnake";
import "./styles.scss";

const SnakeGame = () => {
  const {
    board,
    isPlaying,
    isPause,
    isGameOver,
    pauseGame,
    startGame,
    handleTouchDown,
    isStart,
    level,
    score,
  } = useSnake();

  return (
    <div className="app">
      <h1>SNAKE</h1>
      <div className="elements">
        <Board
          currentBoard={board}
          isPaused={!isPlaying || isPause || isGameOver}
        />
        {isGameOver ? (
          <div className="popup game_over_popup">GAME OVER</div>
        ) : null}
        {isPause ? (
          <div className="popup" onClick={pauseGame}>
            PAUSED
          </div>
        ) : null}
        {isPlaying ? null : (
          <div onClick={startGame} className="start_game popup">
            {isPause ? "NEW GAME" : "START"}
          </div>
        )}
        <div className="controls">
          <div className="info_block">
            <div>SCORE</div>
            <div>{score}</div>
          </div>
          <div className="info_block">
            <div>LEVEL</div>
            <div>{level}</div>
          </div>
          <div className="pause_button">
            {isStart && !isGameOver ? (
              <div onClick={pauseGame} id="paused">
                {isPause ? <ContinueSvg /> : <PauseSvg />}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <ButtonsUI onClick={handleTouchDown} />
    </div>
  );
};

export default SnakeGame;
