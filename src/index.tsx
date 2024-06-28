import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { TelegramProvider } from "./provider/telegram";
import "./index.scss";
import { LocationProvider } from "./provider/location";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <TelegramProvider>
      <LocationProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LocationProvider>
    </TelegramProvider>
  </React.StrictMode>
);
