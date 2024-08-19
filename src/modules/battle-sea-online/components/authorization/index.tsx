import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import NicknameField from "./components/nickname-field";

import { useAppSelector } from "../../redux/hooks";
import { selectLang } from "../../redux/gameSlice";

import "./style.scss";

const l10n = {
  ru: {
    createGame: "Создать игру",
    auth: "Авторизация",
    play: "Играть",
    enter: "Введите код игры",
    connect: "Подключится",
  },
  eng: {
    createGame: "Create game",
    auth: "Authorization",
    play: "Play",
    enter: "Enter the game ID",
    connect: "Connect",
  },
};

const Login = () => {
  const navigate = useNavigate();
  const [invitationGame, setInvitationGame] = useState(false);
  const [gameId, setGameId] = useState<string>("");
  const [nickname, setNickname] = useState("");
  const lang = useAppSelector(selectLang);

  const { auth, play, enter, createGame, connect } = l10n[lang];

  const isGameReady = gameId && nickname;

  const startPlay = () => {
    if (isGameReady) {
      localStorage.nickname = nickname;
      navigate("/battle-sea-online/" + gameId);
    }
  };

  const changeInvState = () => {
    setInvitationGame((prev) => !prev);
  };

  const onCreateGame = () => {
    const id = String(Math.floor(Math.random() * 10001));
    navigate("/battle-sea-online/" + id);
  };

  return (
    <div>
      <h2 className="battleship-authorization-block-title">{auth}</h2>
      <div className="battleship-authorization-block">
        <NicknameField setNickname={setNickname} nickname={nickname} />
        <div className="radio-buttons-wrapper">
          <div
            className={`button ${nickname ? "active" : ""}`}
            onClick={onCreateGame}
          >
            {createGame}
          </div>
          <div
            className={`button ${invitationGame ? "active" : ""}`}
            onClick={changeInvState}
          >
            {connect}
          </div>
        </div>
        <div>
          {invitationGame ? (
            <>
              <div className="text-field">
                <label className="text-field__label" htmlFor="nickname">
                  {enter}
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
              <button
                type="submit"
                onClick={startPlay}
                className="battle-submit-buttom"
                disabled={!gameId || !nickname}
              >
                {play}
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Login;
