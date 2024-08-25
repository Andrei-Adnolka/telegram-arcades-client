import { configureStore } from "@reduxjs/toolkit";
import gameReducer, { GAME_PATH } from "./gameSlice";

export const store = configureStore({
  reducer: {
    [GAME_PATH]: gameReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
