import Board from "../../components/board";
import UpcomingBlocks from "../../components/upcoming-blocks";
import ButtonsUI from "../../components/buttons";
import { useTetris } from "../../hooks/useTetris";

import { PauseSvg } from "../../svg/pause";
import { ContinueSvg } from "../../svg/continue";

import "./styles.scss";

function Tetris() {
  const {
    board,
    startGame,
    pauseGame,
    isPlaying,
    isPause,
    isFinished,
    isStart,
    score,
    upcomingBlocks,
    level,
  } = useTetris();

  const isStoppedGame = isPlaying || isPause;

  return (
    <div className="app">
      <h1>TETRIS</h1>
      <div className="elements">
        <Board
          currentBoard={board}
          isPaused={!isPlaying || isPause || isFinished}
        />
        {isFinished ? (
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
          <div className="new_game_with_upcoming">
            {isStoppedGame ? (
              <UpcomingBlocks upcomingBlocks={upcomingBlocks} />
            ) : null}
          </div>
          <div className="pause_button">
            {isStart && !isFinished ? (
              <div onClick={pauseGame} id="paused">
                {isPause ? <ContinueSvg /> : <PauseSvg />}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <ButtonsUI />
    </div>
  );
}

export default Tetris;
