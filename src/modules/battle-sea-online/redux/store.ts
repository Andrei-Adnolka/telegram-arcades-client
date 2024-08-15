import { configureStore } from "@reduxjs/toolkit";
import userReducer, { USER_PATH } from "./userSlice";
import rivalReducer, { RIVAL_PATH } from "./rivalSlice";
import gameReducer, { GAME_PATH } from "./gameSlice";

export const store = configureStore({
  reducer: {
    [USER_PATH]: userReducer,
    [RIVAL_PATH]: rivalReducer,
    [GAME_PATH]: gameReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
