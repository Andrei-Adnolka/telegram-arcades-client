import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getSendData } from "../helpers";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setIsUserShot } from "../../../redux/gameSlice";
import { setFullData } from "../../../redux/rivalSlice";
import { addNotAllowed, selectUserData } from "../../../redux/userSlice";
import { useCheckShoot } from "./useCheckShoot";

const ws = new WebSocket("ws://localhost:4000");

// @ts-ignore
const send = function (message) {
  waitForConnection(function () {
    ws.send(message);
    // if (typeof callback !== "undefined") {
    //   callback?.();
    // }
  }, 1000);
};

// @ts-ignore
const waitForConnection = function (callback, interval) {
  if (ws.readyState === 1) {
    callback();
  } else {
    // optional: implement backoff for interval here
    setTimeout(function () {
      waitForConnection(callback, interval);
    }, interval);
  }
};

export const useWss = (gameId: string) => {
  const [rivalName, setRivalName] = useState("");
  const [isGameReady, setIsGameReady] = useState(false);
  const dispatch = useAppDispatch();
  const userData = useAppSelector(selectUserData);

  const navigate = useNavigate();
  const { checkShoot } = useCheckShoot(false);

  if (ws) {
    ws.onmessage = function (response) {
      const { type, payload } = JSON.parse(response.data);
      const { username, position, rivalName, success } = payload;

      switch (type) {
        case "connectToPlay":
          if (!success) {
            return navigate("/battle-sea-online");
          }
          setRivalName(rivalName);
          break;
        case "setToState":
          if (username !== localStorage.nickname) {
            dispatch(setFullData(payload.userData));
          }
          break;
        case "readyToPlay":
          if (payload.username === localStorage.nickname && payload.canStart) {
            setIsGameReady(true);
            dispatch(setIsUserShot(payload.isAbleShot));
          }
          break;
        case "afterShootByMe":
          if (username !== localStorage.nickname) {
            const { isHit } = checkShoot(position);
            send(getSendData("checkShoot", { ...payload, isHit, position }));
            if (!isHit) {
              dispatch(setIsUserShot(true));
            }
          }
          break;
        case "isHit":
          if (username === localStorage.nickname) {
            dispatch(setIsUserShot(payload.isHit));
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

  const onConnect = useCallback(() => {
    send(getSendData("connect", { username: localStorage.nickname, gameId }));
  }, [gameId]);

  const onReady = useCallback(() => {
    send(getSendData("ready", { username: localStorage.nickname, gameId }));
    send(
      getSendData("sentData", {
        username: localStorage.nickname,
        gameId,
        userData,
      })
    );
  }, [gameId, userData]);

  const onShoot = useCallback((shoot: number) => {
    send(
      getSendData("shoot", {
        username: localStorage.nickname,
        position: shoot,
        gameId,
      })
    );
  }, []);

  return { onReady, onShoot, onConnect, rivalName, isGameReady };
};
