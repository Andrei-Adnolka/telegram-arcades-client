import { memo, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Board } from "./models/board";
import BoardUI from "./components/board";
import ActionsInfo from "./components/actions-info";

const wss = new WebSocket("ws://localhost:4000");

const changeBoardAfterShoot = (
  board: Board,
  setBoard: (board: Board) => void,
  x: number,
  y: number,
  isPerfectHit: boolean
) => {
  isPerfectHit ? board.addDamage(x, y) : board.addMiss(x, y);
  const newBoard = board.getCopyBoard();
  setBoard(newBoard);
};

const GamePageUI = () => {
  const [myBoard, setMyBoard] = useState(new Board());
  const [hisBoard, setHisBoard] = useState(new Board());
  const [rivalName, setRivalName] = useState("");
  const [shipsReady, setShipsReady] = useState(false);
  const [canShoot, setCanShoot] = useState(false);

  const { gameId } = useParams();
  const navigate = useNavigate();

  const restart = () => {
    const newMyBoard = new Board();
    const newHisBoard = new Board();
    newMyBoard.initCells();
    newHisBoard.initCells();
    setMyBoard(newMyBoard);
    setHisBoard(newHisBoard);
  };

  const shoot = (x: number, y: number) => {
    wss.send(
      JSON.stringify({
        event: "shoot",
        payload: { username: localStorage.nickname, x, y, gameId },
      })
    );
  };

  const ready = () => {
    wss.send(
      JSON.stringify({
        event: "ready",
        payload: { username: localStorage.nickname, gameId },
      })
    );
    setShipsReady(true);
  };

  wss.onmessage = function (response) {
    const { type, payload } = JSON.parse(response.data);
    const { username, x, y, rivalName, success } = payload;
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
          const isPerfectHit = myBoard.cells[y][x]?.mark?.name === "ship";
          changeBoardAfterShoot(myBoard, setMyBoard, x, y, isPerfectHit);
          wss.send(
            JSON.stringify({
              event: "checkShoot",
              payload: { ...payload, isPerfectHit },
            })
          );
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
            x,
            y,
            payload.isPerfectHit
          );
          setCanShoot(payload.isPerfectHit);
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (gameId) {
      wss.send(
        JSON.stringify({
          event: "connect",
          payload: { username: localStorage.nickname, gameId },
        })
      );
      restart();
    }
  }, [gameId]);

  return (
    <div>
      PLASE SHIPS
      <div>
        <div>
          <p>{localStorage.nickname}</p>
          <BoardUI
            board={myBoard}
            isMyBoard
            shipsReady={shipsReady}
            setBoard={setMyBoard}
            canShoot={false}
          />
        </div>
        <div>
          <p>{rivalName}</p>
          <BoardUI
            board={hisBoard}
            setBoard={setHisBoard}
            canShoot={canShoot}
            shoot={shoot}
          />
        </div>
      </div>
      <ActionsInfo ready={ready} canShoot={canShoot} shipsReady={shipsReady} />
    </div>
  );
};

export default memo(GamePageUI);
