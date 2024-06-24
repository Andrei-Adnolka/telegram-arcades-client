import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import { TelegramProvider } from "./provider/telegram";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <TelegramProvider>
      <App />
    </TelegramProvider>
  </React.StrictMode>
);
