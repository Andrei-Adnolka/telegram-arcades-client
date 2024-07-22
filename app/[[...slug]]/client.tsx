"use client";

import React from "react";
import { BrowserRouter } from "react-router-dom";
import dynamic from "next/dynamic";
import { TelegramProvider } from "src/provider/telegram";
import { useMounted } from "src/hooks/useMounted";

const App = dynamic(() => import("../../src/App"), { ssr: false });

export function ClientOnly() {
  const mounted = useMounted();

  return mounted ? (
    <TelegramProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TelegramProvider>
  ) : null;
}
