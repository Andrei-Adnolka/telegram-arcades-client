import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { getSendData } from "../helpers";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectWinner, setIsUserShot } from "../../../redux/gameSlice";
import { setFullData } from "../../../redux/rivalSlice";
import { selectUserData } from "../../../redux/userSlice";
import { useCheckShoot } from "./useCheckShoot";

const ws = new WebSocket("ws://localhost:4000");

// @ts-ignore
const send = function (message) {
  waitForConnection(function () {
    ws.send(message);
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
  const [isRivalReady, setIsRivalReady] = useState(false);
  const [isUserReady, setIsUserReady] = useState(false);
  const [isUserLossed, setIsUserLossed] = useState(false);
  const [timeStart, setTimeStart] = useState(0);
  const dispatch = useAppDispatch();
  const userData = useAppSelector(selectUserData);
  const winner = useAppSelector(selectWinner);
  const navigate = useNavigate();
  const { checkShoot } = useCheckShoot(false);

  const skipIsUserReady = () => {
    setIsUserReady(false);
  };

  const onInitState = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (winner) {
      send(
        getSendData("loss", {
          username: localStorage.nickname,
          youLossed: "true",
          gameId,
        })
      );
    }
  }, [winner, gameId]);

  useEffect(() => {
    if (isUserReady && isRivalReady) {
      send(
        getSendData("sentData", {
          username: localStorage.nickname,
          gameId,
          userData,
        })
      );
      setIsGameReady(true);
      setTimeStart(new Date().getTime());
    }
  }, [isUserReady, gameId, userData, isRivalReady]);

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
          if (payload.username !== localStorage.nickname) {
            setIsRivalReady(true);
            dispatch(setIsUserShot(isUserReady));
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
        case "youLossed":
          if (username !== localStorage.nickname) {
            setIsUserLossed(true);
          }
          break;
        case "isHit":
          if (username === localStorage.nickname) {
            dispatch(setIsUserShot(payload.isHit));
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
    setIsUserReady(true);
    send(getSendData("ready", { username: localStorage.nickname, gameId }));
  }, [gameId]);

  const onShoot = useCallback(
    (shoot: number) => {
      send(
        getSendData("shoot", {
          username: localStorage.nickname,
          position: shoot,
          gameId,
        })
      );
    },
    [gameId]
  );

  return {
    onReady,
    onShoot,
    onConnect,
    onInitState,
    skipIsUserReady,
    rivalName,
    isGameReady,
    isRivalReady,
    isUserReady,
    isUserLossed,
    isWinner: !!winner,
    timeStart,
  };
};
