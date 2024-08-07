import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { SHIPS } from "../components/game-page/constants";
import { getCorrectShip } from "../components/game-page/API/ShipsPlacer/ShipsPlacer";
import { IShip, PERSON } from "../components/game-page/types";

import { RootState } from "./store";

interface GameState {
  isUserShot: boolean;
  winner: PERSON;
}

const initialState: GameState = {
  isUserShot: true,
  winner: "" as PERSON,
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
  },
});

export const { setIsUserShot } = gameSlice.actions;

export const selectIsUserShot = (state: RootState) =>
  state[GAME_PATH].isUserShot;
export const selectWinner = (state: RootState) => state[GAME_PATH].winner;

export default gameSlice.reducer;
