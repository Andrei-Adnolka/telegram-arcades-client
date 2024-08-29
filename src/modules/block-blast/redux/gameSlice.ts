import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "./store";

import { getEmptyBoard, getRandomBlock } from "../hooks/helpers";
import { Block, Blocks, BlockShape, BoardShape } from "../types";

interface GameState {
  board: BoardShape;
  blocks: Blocks;
  score: number;
  isGameOver: boolean;
}

const initialState: GameState = {
  board: [],
  blocks: [],
  score: 0,
  isGameOver: false,
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
      blocksWithEmpty[payload] = {
        block: "empty" as Block,
        shape: [] as BlockShape,
      };
      const newBlocks = blocksWithEmpty.filter(
        (b) => b.block !== ("empty" as Block)
      );
      state.blocks = newBlocks.length ? blocksWithEmpty : getFullBlocks();
    },
    startGame: (state) => {
      state.board = getEmptyBoard();
      state.blocks = getFullBlocks();
    },
    setScore: (state, { payload }: PayloadAction<number>) => {
      state.score += payload;
    },
    setIsGameOver: (state) => {
      state.isGameOver = true;
    },
    setState: (state, { payload }: PayloadAction<GameState>) => {
      state.blocks = payload.blocks;
      state.board = payload.board;
      state.score = payload.score;
    },
  },
});

export const {
  setBoard,
  startGame,
  updatedBlocks,
  setScore,
  setState,
  setIsGameOver,
} = gameSlice.actions;

export const selectBoard = (state: RootState) => state[GAME_PATH].board;
export const selectBlocks = (state: RootState) => state[GAME_PATH].blocks;
export const selectScore = (state: RootState) => state[GAME_PATH].score;
export const selectIsGameOver = (state: RootState) =>
  state[GAME_PATH].isGameOver;

export default gameSlice.reducer;
