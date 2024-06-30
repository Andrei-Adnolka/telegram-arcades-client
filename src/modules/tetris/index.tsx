import Board from "../../components/board";
import ButtonsUI from "../../components/buttons";
import { PauseSvg } from "../../svg/pause";
import { ContinueSvg } from "../../svg/continue";

import UpcomingBlocks from "./components/upcoming-blocks";
import { useTetris } from "./hooks/useTetris";

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
    hightScore,
    isContinue,
    onContinue,
  } = useTetris();

  const isStoppedGame = isPlaying || isPause;
  return (
    <div className="wrapper">
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
          <div className="popup paused_popup" onClick={pauseGame}>
            PAUSED
          </div>
        ) : null}
        {isContinue ? (
          <div className="popup paused_popup" onClick={onContinue}>
            CONTINUE
          </div>
        ) : null}
        {isPlaying ? null : (
          <div onClick={startGame} className="start_game popup">
            {isPause ? "NEW GAME" : "START"}
          </div>
        )}
        <div className="controls">
          <div className="info_block">
            <div>HIGH SCORE</div>
            <div>{hightScore}</div>
          </div>
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
