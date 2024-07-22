"use client";

import React from "react";
import { BrowserRouter } from "react-router-dom";
import dynamic from "next/dynamic";
import { TelegramProvider } from "src/provider/telegram";

const App = dynamic(() => import("../../src/App"), { ssr: false });

export function ClientOnly() {
  return (
    <TelegramProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TelegramProvider>
  );
}
