import { memo, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Board } from "./models/board";
import ActionsInfo from "./components/actions-info";
import { changeBoardAfterShoot, getSendData } from "./helpers";

import Field from "./components/field";
import ShipStation from "./components/shipStation";

const wss = new WebSocket("ws://localhost:4000");

const GamePageUI = () => {
  const [myBoard, setMyBoard] = useState(new Board());
  const [hisBoard, setHisBoard] = useState(new Board());
  const [rivalName, setRivalName] = useState("");
  const [shipsReady, setShipsReady] = useState(false);
  const [canShoot, setCanShoot] = useState(false);
  const isFirstSend = useRef(false);

  const params = useParams();
  const gameId = params.gameId as string;
  const navigate = useNavigate();

  const getInitBoard = () => {
    const newMyBoard = new Board();
    newMyBoard.initCells();
    return newMyBoard;
  };

  const getMyShips = () => {
    const newMyBoard = getInitBoard();
    // const randomShips = getRandomShips();
    // randomShips.forEach((ship) => {
    //   newMyBoard.addFullShip(ship.shipLocation);
    // });
    setMyBoard(newMyBoard);
  };

  const restart = () => {
    const newHisBoard = getInitBoard();
    setHisBoard(newHisBoard);
    getMyShips();
  };

  const shoot = (shoot: number) => {
    wss.send(
      getSendData("shoot", {
        username: localStorage.nickname,
        position: shoot,
        gameId,
      })
    );
  };

  const ready = () => {
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
            const isPerfectHit = myBoard.cells[position]?.mark?.name === "ship";
            changeBoardAfterShoot(myBoard, setMyBoard, position, isPerfectHit);
            wss.send(getSendData("checkShoot", { ...payload, isPerfectHit }));
            if (!isPerfectHit) {
              setCanShoot(true);
            }
          }
          break;
        case "isPerfectHit":
          if (username === localStorage.nickname) {
            changeBoardAfterShoot(
              hisBoard,
              setHisBoard,
              position,
              payload.isPerfectHit
            );
            setCanShoot(payload.isPerfectHit);
          }
          break;
        default:
          break;
      }
    };
  }

  useEffect(() => {
    if (isFirstSend.current) {
      restart();
      wss.send(
        getSendData("connect", { username: localStorage.nickname, gameId })
      );
      isFirstSend.current = false;
    }
  }, []);

  return (
    <div>
      <h1>PLASE SHIPS</h1>
      <div className="battle_sea_wrapper__boards">
        <div className="battle_sea_wrapper__board">
          <p>YOUR BOARD</p>
          {/* <BoardUI
            board={myBoard}
            isMyBoard
            shipsReady={shipsReady}
            setBoard={setMyBoard}
            canShoot={false}
          /> */}
          <Field
            isRival={false}
            isOnline={true}
            isStarted={shipsReady}
            sendSocket={shoot}
          />
        </div>
        <ActionsInfo
          onReady={ready}
          onRandomShips={getMyShips}
          canShoot={canShoot}
          shipsReady={shipsReady}
        />
        <ShipStation isReady={shipsReady} />
        {/* <div className="battle_sea_wrapper__board">
          {rivalName ? (
            <>
              <p>RIVAL BOARD {rivalName}</p>
              <BoardUI
                board={hisBoard}
                setBoard={setHisBoard}
                canShoot={canShoot}
                shoot={shoot}
              />
            </>
          ) : (
            <div className="battle_sea_wrapper__wait">
              <div>WAITING OPPONENT</div>
              <div className="loader-container">
                <div className="loader-2" />
              </div>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default memo(GamePageUI);
