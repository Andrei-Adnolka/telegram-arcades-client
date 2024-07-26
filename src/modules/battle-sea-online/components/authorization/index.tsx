import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [invitationGame, setInvitationGame] = useState("");
  const [nickname, setNickname] = useState("");
  const [gameId, setGameId] = useState<string>("");

  const startPlay = () => {
    if (gameId && nickname) {
      localStorage.nickname = nickname;
      navigate("/battle-sea-online/" + gameId);
    }
  };

  const radioValue1 = invitationGame !== "ingame" ? "1" : "";
  const radioValue2 = invitationGame === "ingame" ? "1" : "";

  return (
    <div>
      <h2>AUTHORIZATION</h2>
      <div>
        <div>
          <label htmlFor="nickname">Your name</label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div onChange={(e) => setInvitationGame((e.target as HTMLElement).id)}>
          <input
            type="radio"
            name="typeEnter"
            id="gen"
            value={radioValue1}
            defaultChecked={invitationGame !== "ingame"}
          />
          <label htmlFor="gen">Create Game</label>
          <input
            type="radio"
            name="typeEnter"
            id="ingame"
            value={radioValue2}
            defaultChecked={invitationGame === "ingame"}
          />
          <label htmlFor="ingame">Go to created game</label>
        </div>
        <div>
          {invitationGame === "ingame" ? (
            <>
              <div>
                <label htmlFor="gameId">Enter the game ID</label>
              </div>
              <input
                type="text"
                name="gameId"
                id="gameId"
                defaultValue=""
                onChange={(e) => setGameId(e.target.value)}
              />
            </>
          ) : (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setGameId(String(Date.now()));
                }}
              >
                Generate game id
              </button>
              <p>{gameId}</p>
            </>
          )}
        </div>
      </div>
      <button type="submit" onClick={startPlay}>
        Game
      </button>
    </div>
  );
};

export default Login;
