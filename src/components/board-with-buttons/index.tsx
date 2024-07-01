import { FC } from "react";

import Board from "../../components/board";
import ButtonsUI from "../../components/buttons";
import { PauseSvg } from "../../svg/pause";
import { ContinueSvg } from "../../svg/continue";

import UpcomingBlocks from "../../modules/tetris/components/upcoming-blocks";
import { ButtonIds } from "../../constants";
import { Block, BoardShape } from "../../types";

import "./styles.scss";

type Props = {
  board: BoardShape;
  startGame: () => void;
  pauseGame: () => void;
  handleTouchDown?: (id: ButtonIds, isTouchStart?: boolean) => void;
  score: number;
  onContinue: () => void;
  level: number;
  upcomingBlocks?: Block[];
  hightScore: number;
  isPlaying: boolean;
  isPause: boolean;
  isGameOver: boolean;
  isStart: boolean;
  isContinue: boolean;
  isShowUpcomingsBlocks?: boolean;
  title: string;
};

const BoardWithButtons: FC<Props> = (props) => {
  const {
    board,
    startGame,
    pauseGame,
    isPlaying,
    isPause,
    isGameOver,
    isStart,
    score,
    upcomingBlocks,
    level,
    hightScore,
    isContinue,
    onContinue,
    handleTouchDown,
    isShowUpcomingsBlocks,
    title,
  } = props;

  const isStoppedGame = isPlaying || isPause;
  return (
    <div className="wrapper">
      <h1>{title}</h1>
      <div className="elements">
        <Board
          currentBoard={board}
          isPaused={!isPlaying || isPause || isGameOver}
        />
        {isGameOver ? (
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
          {isShowUpcomingsBlocks && upcomingBlocks ? (
            <div className="new_game_with_upcoming">
              {isStoppedGame ? (
                <UpcomingBlocks upcomingBlocks={upcomingBlocks} />
              ) : null}
            </div>
          ) : null}
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

export default BoardWithButtons;
