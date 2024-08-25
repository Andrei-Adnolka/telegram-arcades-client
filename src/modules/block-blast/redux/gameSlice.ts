import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "./store";
import { BoardShape } from "../../../types";
import { getEmptyBoard, getRandomBlock } from "../hooks/helpers";
import { Block } from "../types";

interface GameState {
  board: BoardShape;
  blocks: Block[];
  score: number;
}

const initialState: GameState = {
  board: [],
  blocks: [],
  score: 0,
};

export const GAME_PATH = "game";

const getFullBlocks = () => [
  getRandomBlock(),
  getRandomBlock(),
  getRandomBlock(),
];

export const gameSlice = createSlice({
  name: GAME_PATH,
  initialState,
  reducers: {
    setBoard: (state, { payload }: PayloadAction<BoardShape>) => {
      state.board = payload;
    },
    updatedBlocks: (state, { payload }: PayloadAction<number>) => {
      const blocksWithEmpty = [...state.blocks];
      blocksWithEmpty[payload] = "empty" as Block;
      const newBlocks = blocksWithEmpty.filter((b) => b !== ("empty" as Block));
      state.blocks = newBlocks.length ? blocksWithEmpty : getFullBlocks();
    },
    startGame: (state) => {
      state.board = getEmptyBoard();
      state.blocks = getFullBlocks();
    },
    setScore: (state, { payload }: PayloadAction<number>) => {
      state.score += payload;
    },
  },
});

export const { setBoard, startGame, updatedBlocks, setScore } =
  gameSlice.actions;

export const selectBoard = (state: RootState) => state[GAME_PATH].board;
export const selectBlocks = (state: RootState) => state[GAME_PATH].blocks;
export const selectScore = (state: RootState) => state[GAME_PATH].score;

export default gameSlice.reducer;
