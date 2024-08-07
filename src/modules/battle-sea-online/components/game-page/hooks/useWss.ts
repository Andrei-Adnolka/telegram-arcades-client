import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getSendData } from "../helpers";

const wss = new WebSocket("ws://localhost:4000");

export const useWss = () => {
  const [rivalName, setRivalName] = useState("");
  const [isGameReady, setIsGameReady] = useState(false);
  const [canShoot, setCanShoot] = useState(false);
  const isFirstSend = useRef(false);

  const navigate = useNavigate();
  const params = useParams();
  const gameId = params.gameId || "";

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

  const onReady = () => {
    wss.send(getSendData("ready", { username: localStorage.nickname, gameId }));
    setIsGameReady(true);
  };

  return { onReady, rivalName, isGameReady };
};
