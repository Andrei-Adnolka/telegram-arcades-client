import { FC, memo, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSendData } from "./helpers";

import { useAppSelector } from "../../redux/hooks";
import { selectShips } from "../../redux/userSlice";

import UserField from "./components/userField";
import Field from "./components/field";
import { useStatusText } from "./hooks/useStatusText";

const wss = new WebSocket("ws://localhost:4000");

type Props = {
  gameId: string;
};

const GamePageUI: FC<Props> = ({ gameId }) => {
  const [rivalName, setRivalName] = useState("");
  const [shipsReady, setShipsReady] = useState(false);
  const [canShoot, setCanShoot] = useState(false);
  const isFirstSend = useRef(false);
  const userShips = useAppSelector(selectShips);

  const navigate = useNavigate();

  const shoot = (shoot: number) => {
    wss.send(
      getSendData("shoot", {
        username: localStorage.nickname,
        position: shoot,
        gameId,
      })
    );
  };

  const onReady = () => {
    wss.send(getSendData("ready", { username: localStorage.nickname, gameId }));
    setShipsReady(true);
  };

  if (wss) {
    wss.onmessage = function (response) {
      const { type, payload } = JSON.parse(response.data);
      const { username, position, rivalName, success } = payload;
      switch (type) {
        case "connectToPlay":
          if (!success) {
            return navigate("/battle-sea-online");
          }
          setRivalName(rivalName);
          break;
        case "readyToPlay":
          if (payload.username === localStorage.nickname && payload.canStart) {
            setCanShoot(true);
          }
          break;
        case "afterShootByMe":
          if (username !== localStorage.nickname) {
            // const isPerfectHit = myBoard.cells[position]?.mark?.name === "ship";
            // changeBoardAfterShoot(myBoard, setMyBoard, position, isPerfectHit);
            // wss.send(getSendData("checkShoot", { ...payload, isPerfectHit }));
            // if (!isPerfectHit) {
            //   setCanShoot(true);
            // }
          }
          break;
        case "isPerfectHit":
          if (username === localStorage.nickname) {
            // changeBoardAfterShoot(
            //   hisBoard,
            //   setHisBoard,
            //   position,
            //   payload.isPerfectHit
            // );
            // setCanShoot(payload.isPerfectHit);
          }
          break;
        default:
          break;
      }
    };
  }

  useEffect(() => {
    if (isFirstSend.current) {
      wss.send(
        getSendData("connect", { username: localStorage.nickname, gameId })
      );
      isFirstSend.current = false;
    }
  }, []);

  const { statusText, statusClassName } = useStatusText(userShips.length);

  return (
    <div>
      <h1>PLASE SHIPS</h1>
      <div className="battle_sea_wrapper__boards">
        <div className="battle_sea_wrapper__board">
          {shipsReady ? null : (
            <>
              <p>{(localStorage.nickname || "YOUR BOARD").toUpperCase()}</p>
              <span className={statusClassName.join(" ")} onClick={onReady}>
                {statusText}
              </span>
              <UserField />
            </>
          )}
          {shipsReady ? (
            <>
              <div className="battle_sea_wrapper__board">
                <p>{(localStorage.nickname || "YOUR BOARD").toUpperCase()}</p>
                <Field isRival={false} isOnline sendSocket={shoot} />
              </div>
              <div className="battle_sea_wrapper__board">
                {rivalName ? (
                  <>
                    <p>{(rivalName || "RIVAL BOARD").toUpperCase()}</p>
                    <Field isRival isOnline sendSocket={shoot} />
                  </>
                ) : (
                  <div className="battle_sea_wrapper__wait">
                    <div>WAITING OPPONENT</div>
                    <div className="loader-container">
                      <div className="loader-2" />
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default memo(GamePageUI);
