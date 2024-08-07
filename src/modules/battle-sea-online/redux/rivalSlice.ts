import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { SHIPS } from "../components/game-page/constants";
import { getCorrectShip } from "../components/game-page/API/ShipsPlacer/ShipsPlacer";
import { IShip } from "../components/game-page/types";

import { RootState } from "./store";

interface UserState {
  ships: IShip[];
  misses: number[];
  notAllowed: number[];
}

const initialState: UserState = {
  ships: [],
  misses: [],
  notAllowed: [],
};

export const RIVAL_PATH = "rival";

export const userSlice = createSlice({
  name: RIVAL_PATH,
  initialState,
  reducers: {
    resetShips: (state) => {
      state.ships = [] as IShip[];
    },
    addShips: (state, { payload }: PayloadAction<IShip[]>) => {
      state.ships = payload;
    },
    setRandomShips: (state) => {
      const newShips: IShip[] = [];
      SHIPS.forEach((ship) => {
        getCorrectShip([], newShips, ship);
      });
      state.ships = newShips;
    },
  },
});

export const { resetShips, setRandomShips } = userSlice.actions;

export const selectShips = (state: RootState) => state[RIVAL_PATH].ships;
export const selectMisses = (state: RootState) => state[RIVAL_PATH].misses;
export const selectNotAllowed = (state: RootState) =>
  state[RIVAL_PATH].notAllowed;
export const selectRivalData = (state: RootState) => state[RIVAL_PATH];

export default userSlice.reducer;
