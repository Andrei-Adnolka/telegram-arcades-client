import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
// import { TelegramProvider } from "./provider/telegram";
import "./index.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    {/* <TelegramProvider> */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/* </TelegramProvider> */}
  </React.StrictMode>
);
