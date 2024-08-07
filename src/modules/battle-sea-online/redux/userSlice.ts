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

export const USER_PATH = "user";

export const userSlice = createSlice({
  name: USER_PATH,
  initialState,
  reducers: {
    addShip: (state, { payload }: PayloadAction<IShip>) => {
      state.ships.push(payload);
    },
    addNewShips: (state, { payload }: PayloadAction<IShip[]>) => {
      state.ships = payload;
    },
    resetShips: (state) => {
      state.ships = [] as IShip[];
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

export const { addShip, addNewShips, resetShips, setRandomShips } =
  userSlice.actions;

export const selectShips = (state: RootState) => state[USER_PATH].ships;
export const selectMisses = (state: RootState) => state[USER_PATH].misses;
export const selectNotAllowed = (state: RootState) =>
  state[USER_PATH].notAllowed;
export const selectUserData = (state: RootState) => state[USER_PATH];

export default userSlice.reducer;
