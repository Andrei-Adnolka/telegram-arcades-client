import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useTelegram } from "../provider/telegram";

export function useBackButton() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isLoadedGame = pathname !== "/";
  const { webApp } = useTelegram();

  useEffect(() => {
    const callback = () => {
      navigate(-1);
      webApp?.BackButton?.hide?.();
    };

    if (webApp) {
      webApp.BackButton.isVisible = isLoadedGame;
      webApp.onEvent("backButtonClicked", callback);
    }
    return () => webApp && webApp.offEvent("backButtonClicked", callback);
  }, [isLoadedGame, webApp, navigate]);
}
