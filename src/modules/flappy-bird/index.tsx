import Bird from "./components/bird";
import Pipe from "./components/pipe";
import Foreground from "./components/foreground";

import { useFlappy } from "./hooks/useFlappy";

import "./style.scss";

const FlappyBird = () => {
  const { x, y, r, pipes, score, hightScore, isPlaying, startGame } =
    useFlappy();

  return (
    <div className="flappy_wrapper">
      <h1>FLAPPY BIRD</h1>
      {isPlaying ? null : (
        <div onClick={startGame} className="start_game popup">
          NEW GAME
        </div>
      )}
      <div
        className="flappy_wrapper__board"
        id="foreground"
        style={{ background: "url(/flappy-images/bg.png)" }}
      >
        <Bird y={y} r={r} />
        <Pipe x={x} pipes={pipes} />
        <Foreground />
        <div className="flappy_wrapper__score">
          <div>SCORE</div>
          <div>{score}</div>
        </div>
        <div className="flappy_wrapper__hight_score">
          <div>HIGHT SCORE</div>
          <div>{hightScore}</div>
        </div>
      </div>
    </div>
  );
};

export default FlappyBird;
