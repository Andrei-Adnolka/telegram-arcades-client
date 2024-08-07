import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PERSON } from "../components/game-page/types";

import { RootState } from "./store";

interface GameState {
  isUserShot: boolean;
  winner: PERSON;
  sound: boolean;
}

const initialState: GameState = {
  isUserShot: true,
  winner: "" as PERSON,
  sound: true,
};

export const GAME_PATH = "game";

export const gameSlice = createSlice({
  name: GAME_PATH,
  initialState,
  reducers: {
    setIsUserShot: (state, { payload }: PayloadAction<boolean>) => {
      state.isUserShot = payload;
    },
    setWinner: (state, { payload }: PayloadAction<PERSON>) => {
      state.winner = payload;
    },
    setSound: (state, { payload }: PayloadAction<boolean>) => {
      state.sound = payload;
    },
  },
});

export const { setIsUserShot, setWinner } = gameSlice.actions;

export const selectIsUserShot = (state: RootState) =>
  state[GAME_PATH].isUserShot;
export const selectWinner = (state: RootState) => state[GAME_PATH].winner;
export const selectSound = (state: RootState) => state[GAME_PATH].sound;

export default gameSlice.reducer;
