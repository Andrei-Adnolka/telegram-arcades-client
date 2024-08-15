import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { SHIPS } from "../components/game-page/constants";
import { getCorrectShip } from "../components/game-page/API/ShipsPlacer/ShipsPlacer";
import { IShip } from "../components/game-page/types";

import { IPlayerState } from "../components/game-page/types";

import { RootState } from "./store";

const initialState: IPlayerState = {
  ships: [],
  misses: [],
  notAllowed: [],
};

export const RIVAL_PATH = "rival";

export const rivalSlice = createSlice({
  name: RIVAL_PATH,
  initialState,
  reducers: {
    resetShips: (state) => {
      state.ships = [] as IShip[];
    },
    addNewShips: (state, { payload }: PayloadAction<IShip[]>) => {
      state.ships = payload;
    },
    setRandomShips: (state) => {
      const newShips: IShip[] = [];
      SHIPS.forEach((ship) => {
        getCorrectShip([], newShips, ship);
      });
      state.ships = newShips;
    },
    addNotAllowed: (state, { payload }: PayloadAction<number[]>) => {
      state.notAllowed = [...state.notAllowed, ...payload];
    },
    sendMisses: (state, { payload }: PayloadAction<number>) => {
      state.misses = [...state.misses, payload];
    },
    setFullData: (state, { payload }: PayloadAction<IPlayerState>) => {
      state.ships = payload.ships;
      state.misses = payload.misses;
      state.notAllowed = payload.notAllowed;
    },
    setInitState: (state) => {
      state = initialState;
    },
  },
});

export const {
  resetShips,
  setRandomShips,
  addNewShips,
  addNotAllowed,
  setFullData,
  setInitState,
} = rivalSlice.actions;

export const selectShips = (state: RootState) => state[RIVAL_PATH].ships;
export const selectMisses = (state: RootState) => state[RIVAL_PATH].misses;
export const selectNotAllowed = (state: RootState) =>
  state[RIVAL_PATH].notAllowed;
export const selectRivalData = (state: RootState) => state[RIVAL_PATH];

export default rivalSlice.reducer;
