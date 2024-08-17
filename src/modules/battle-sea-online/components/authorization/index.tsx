import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import RadioButtons from "./components/radio-buttons";
import NicknameField from "./components/nickname-field";

import "./style.scss";

const Login = () => {
  const navigate = useNavigate();
  const [invitationGame, setInvitationGame] = useState("Create Game");
  const [gameId, setGameId] = useState<string>("");
  const [nickname, setNickname] = useState("");

  const startPlay = () => {
    if (gameId && nickname) {
      localStorage.nickname = nickname;
      navigate("/battle-sea-online/" + gameId);
    }
  };

  const isCreateGame = invitationGame === "Create Game";

  useEffect(() => {
    if (isCreateGame) {
      setGameId(String(Math.floor(Math.random() * 10001)));
    } else {
      setGameId("");
    }
  }, [isCreateGame]);

  return (
    <div>
      <h2 className="battleship-authorization-block-title">AUTHORIZATION</h2>
      <div className="battleship-authorization-block">
        <NicknameField setNickname={setNickname} nickname={nickname} />
        <div
          onChange={(e) => setInvitationGame((e.target as HTMLElement).id)}
          className="radio-buttons-wrapper"
        >
          <RadioButtons activeId={invitationGame} />
        </div>
        <div>
          {invitationGame === "Go to game" ? (
            <div className="text-field">
              <label className="text-field__label" htmlFor="nickname">
                Enter the game ID
              </label>
              <input
                className="text-field__input"
                type="text"
                name="gameId"
                id="gameId"
                onChange={(e) => setGameId(e.target.value)}
                defaultValue=""
              />
            </div>
          ) : null}
        </div>
      </div>
      <button
        type="submit"
        onClick={startPlay}
        className="battle-submit-buttom"
        disabled={!gameId || !nickname}
      >
        Play
      </button>
    </div>
  );
};

export default Login;
