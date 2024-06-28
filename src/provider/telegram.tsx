import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";

import type { ITelegramUser, IWebApp } from "../types/telegram";

export interface ITelegramContext {
  webApp?: IWebApp;
  user?: ITelegramUser;
}

export const TelegramContext = createContext<ITelegramContext>({});
type Props = { children: React.ReactNode };

export const TelegramProvider = ({ children }: Props) => {
  const [webApp, setWebApp] = useState<IWebApp | null>(null);

  useEffect(() => {
    const app = (window as any).Telegram?.WebApp;
    if (app) {
      app.ready();
      setWebApp(app);
      app.expand();
      app.onEvent("beforeunload", () => {
        Cookies.set("exitPage", "i will back", { expires: 1 });
      });
    }
  }, []);

  const value = useMemo(() => {
    return webApp
      ? {
          webApp,
          unsafeData: webApp.initDataUnsafe,
          user: webApp.initDataUnsafe.user,
        }
      : {};
  }, [webApp]);

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => useContext(TelegramContext);
