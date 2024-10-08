import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { getSendData } from "../helpers";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectWinner, setIsUserShot } from "../../../redux/gameSlice";
import { setFullData } from "../../../redux/rivalSlice";
import { selectUserData } from "../../../redux/userSlice";
import { useCheckShoot } from "./useCheckShoot";
import { useUnload } from "./useUnload";

const API_URL = "101rest.by/api/websocketInit";

const updatedWrapperElement = (value: string) => {
  const el = document.getElementById("battleships-wrapper");

  if (el) {
    el.style.overflow = value;
  }
};

export const useWss = (gameId: string) => {
  const [rivalName, setRivalName] = useState("");
  const [isGameReady, setIsGameReady] = useState(false);
  const [isRivalReady, setIsRivalReady] = useState(false);
  const [isUserReady, setIsUserReady] = useState(false);
  const [isUserLossed, setIsUserLossed] = useState(false);
  const [isRivalLeft, setIsRivalLeft] = useState(false);
  const [timeStart, setTimeStart] = useState(0);
  const dispatch = useAppDispatch();
  const userData = useAppSelector(selectUserData);
  const winner = useAppSelector(selectWinner);
  const navigate = useNavigate();
  const { checkShoot } = useCheckShoot(false);

  const ws = useRef<WebSocket>(null);
  const isFirstLoad = useRef(true);

  // @ts-ignore
  const waitForConnection = useCallback((callback, interval) => {
    if (ws.current) {
      if (ws.current.readyState === 1) {
        callback();
      } else {
        setTimeout(function () {
          waitForConnection(callback, interval);
        }, interval);
      }
    }
  }, []);

  const send = useCallback(
    (message: string) => {
      waitForConnection(function () {
        if (ws.current) {
          ws.current.send(message);
        }
      }, 1000);
    },
    [waitForConnection]
  );

  const skipIsUserReady = () => {
    setIsUserReady(false);
    document.body.style.overflow = "hidden";
    updatedWrapperElement("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onInitState = () => {
    window.location.reload();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onConnect = useCallback(() => {
    send(getSendData("connect", { username: localStorage.nickname, gameId }));
  }, [send, gameId]);

  const onReady = useCallback(() => {
    setIsUserReady(true);
    send(getSendData("ready", { username: localStorage.nickname, gameId }));
    document.body.style.overflow = "auto";
    updatedWrapperElement("auto");
  }, [send, gameId]);

  const fetchData = async () => {
    await fetch(`https://${API_URL}`);
    // @ts-ignore
    ws.current = new WebSocket(`wss://${API_URL}`);
  };

  useEffect(() => {
    if (isFirstLoad.current) {
      fetchData();
      setTimeout(() => {
        onConnect();
      }, 1000);

      isFirstLoad.current = false;
    }
    // eslint-disable-next-line
  }, []);

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
  }, [winner, gameId, send]);

  useUnload(() => {
    send(
      getSendData("reload", {
        username: localStorage.nickname,
        gameId,
      })
    );
  });

  useEffect(() => {
    if (isUserReady && isRivalReady && !isGameReady) {
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
  }, [isUserReady, gameId, userData, isRivalReady, isGameReady, send]);

  if (ws.current) {
    ws.current.onmessage = function (response) {
      const { type, payload } = JSON.parse(response.data);
      const { username, position, success } = payload;

      switch (type) {
        case "connectToPlay":
          if (!success) {
            return navigate("/battle-sea-online");
          }
          if (payload.rivalName) {
            setRivalName(payload.rivalName);
          }
          if (payload.isRivalReady) {
            setIsRivalReady(payload.isRivalReady);
            dispatch(setIsUserShot(false));
          }
          break;
        case "setToState":
          if (username !== localStorage.nickname) {
            setIsRivalReady(true);
            dispatch(setFullData(payload.userData));
            if (!rivalName) {
              setRivalName(payload.rivalName);
            }
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
        case "reloadRival":
          if (username !== localStorage.nickname) {
            setIsRivalLeft(true);
            setTimeout(() => {
              navigate("/battle-sea-online");
            }, 2000);
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
    [gameId, send]
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
    isRivalLeft,
  };
};
