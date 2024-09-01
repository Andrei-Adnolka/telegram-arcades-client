import { flattenDeep, isEqual, isNil } from "lodash";
import { uid } from "uid";
import { tileCountPerDimension } from "../constants";
import { Tile, TileMap } from "../models/tile";

type Board = string[][];

export type State = {
  board: Board;
  tiles: TileMap;
  tilesByIds: string[];
  hasChanged: boolean;
  isGameOver: boolean;
  score: number;
};
type Action =
  | { type: "create_tile"; tile: Tile }
  | { type: "set_state"; state: State }
  | { type: "clean_up" }
  | { type: "move_up" }
  | { type: "move_down" }
  | { type: "move_left" }
  | { type: "move_right" };

function createBoard() {
  const board: string[][] = [];

  for (let i = 0; i < tileCountPerDimension; i += 1) {
    board[i] = new Array(tileCountPerDimension).fill(undefined);
  }

  return board;
}

export const initialState: State = {
  board: createBoard(),
  tiles: {},
  tilesByIds: [],
  hasChanged: false,
  isGameOver: false,
  score: 0,
};

const getIsCanChange = (board: Board, tiles: TileMap, boardSize: number) => {
  const canChangesIds = [] as string[];

  for (let x = 0; x < tileCountPerDimension; x++) {
    for (let y = 0; y < tileCountPerDimension; y++) {
      const el = board[x][y];
      let rightEl = board?.[x]?.[y + 1];
      let leftEl = board?.[x]?.[y - 1];
      let topEl = board?.[x - 1]?.[y];
      let bottomEl = board?.[x + 1]?.[y];

      const elValue = tiles[el].value;
      const a = [rightEl, leftEl, topEl, bottomEl]
        .filter((el) => el)
        .map((id) => tiles[id].value);

      if (!a.includes(elValue)) {
        canChangesIds.push(el);
      }
    }
  }

  return { isCanChange: canChangesIds.length < boardSize };
};

const checkIsGameOver = (prevBoard: Board, newBoard: Board, tiles: TileMap) => {
  if (isEqual(prevBoard, newBoard)) {
    const flattenBoard = flattenDeep(newBoard).filter((cell) => cell);
    const boardSize = tileCountPerDimension * tileCountPerDimension;
    if (
      flattenBoard.length === boardSize &&
      !getIsCanChange(newBoard, tiles, boardSize)?.isCanChange
    ) {
      return true;
    }
  }

  return false;
};

export default function gameReducer(
  state: State = initialState,
  action: Action
) {
  switch (action.type) {
    case "set_state": {
      return { ...action.state };
    }
    case "clean_up": {
      const flattenBoard = flattenDeep(state.board);
      const newTiles: TileMap = flattenBoard.reduce(
        (result, tileId: string) => {
          if (isNil(tileId)) {
            return result;
          }

          return { ...result, [tileId]: state.tiles[tileId] };
        },
        {}
      );

      return {
        ...state,
        tiles: newTiles,
        tilesByIds: Object.keys(newTiles),
        hasChanged: false,
      };
    }
    case "create_tile": {
      const tileId = uid();
      const [x, y] = action.tile.position;
      const newBoard = JSON.parse(JSON.stringify(state.board));
      newBoard[y][x] = tileId;

      return {
        ...state,
        board: newBoard,
        tiles: { ...state.tiles, [tileId]: { id: tileId, ...action.tile } },
        tilesByIds: [...state.tilesByIds, tileId],
      };
    }
    case "move_up": {
      const newBoard = createBoard();
      const newTiles: TileMap = {};
      let hasChanged = false;
      let { score } = state;

      for (let x = 0; x < tileCountPerDimension; x++) {
        let newY = 0;
        let previousTile: Tile | undefined;

        for (let y = 0; y < tileCountPerDimension; y++) {
          const tileId = state.board[y][x];
          const currentTile = state.tiles[tileId];

          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              const value = previousTile.value * 2;
              score += value;
              newTiles[previousTile.id as string] = { ...previousTile, value };
              newTiles[tileId] = { ...currentTile, position: [x, newY - 1] };
              previousTile = undefined;
              hasChanged = true;
              continue;
            }

            newBoard[newY][x] = tileId;
            newTiles[tileId] = { ...currentTile, position: [x, newY] };
            previousTile = newTiles[tileId];
            if (!isEqual(currentTile.position, [x, newY])) {
              hasChanged = true;
            }
            newY++;
          }
        }
      }

      return {
        ...state,
        isGameOver: checkIsGameOver(state.board, newBoard, newTiles),
        board: newBoard,
        tiles: newTiles,
        hasChanged,
        score,
      };
    }
    case "move_down": {
      const newBoard = createBoard();
      const newTiles: TileMap = {};
      let hasChanged = false;
      let { score } = state;

      for (let x = 0; x < tileCountPerDimension; x++) {
        let newY = tileCountPerDimension - 1;
        let previousTile: Tile | undefined;

        for (let y = tileCountPerDimension - 1; y >= 0; y--) {
          const tileId = state.board[y][x];
          const currentTile = state.tiles[tileId];

          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              const value = previousTile.value * 2;
              score += value;
              newTiles[previousTile.id as string] = { ...previousTile, value };
              newTiles[tileId] = { ...currentTile, position: [x, newY + 1] };
              previousTile = undefined;
              hasChanged = true;
              continue;
            }

            newBoard[newY][x] = tileId;
            newTiles[tileId] = { ...currentTile, position: [x, newY] };
            previousTile = newTiles[tileId];
            if (!isEqual(currentTile.position, [x, newY])) {
              hasChanged = true;
            }
            newY--;
          }
        }
      }
      return {
        ...state,
        isGameOver: checkIsGameOver(state.board, newBoard, newTiles),
        board: newBoard,
        tiles: newTiles,
        hasChanged,
        score,
      };
    }
    case "move_left": {
      const newBoard = createBoard();
      const newTiles: TileMap = {};
      let hasChanged = false;
      let { score } = state;

      for (let y = 0; y < tileCountPerDimension; y++) {
        let newX = 0;
        let previousTile: Tile | undefined;

        for (let x = 0; x < tileCountPerDimension; x++) {
          const tileId = state.board[y][x];
          const currentTile = state.tiles[tileId];

          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              const value = previousTile.value * 2;
              score += value;
              newTiles[previousTile.id as string] = { ...previousTile, value };
              newTiles[tileId] = { ...currentTile, position: [newX - 1, y] };
              previousTile = undefined;
              hasChanged = true;
              continue;
            }

            newBoard[y][newX] = tileId;
            newTiles[tileId] = { ...currentTile, position: [newX, y] };
            previousTile = newTiles[tileId];
            if (!isEqual(currentTile.position, [newX, y])) {
              hasChanged = true;
            }
            newX++;
          }
        }
      }

      return {
        ...state,
        isGameOver: checkIsGameOver(state.board, newBoard, newTiles),
        board: newBoard,
        tiles: newTiles,
        hasChanged,
        score,
      };
    }
    case "move_right": {
      const newBoard = createBoard();
      const newTiles: TileMap = {};
      let hasChanged = false;
      let { score } = state;

      for (let y = 0; y < tileCountPerDimension; y++) {
        let newX = tileCountPerDimension - 1;
        let previousTile: Tile | undefined;

        for (let x = tileCountPerDimension - 1; x >= 0; x--) {
          const tileId = state.board[y][x];
          const currentTile = state.tiles[tileId];

          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              const value = previousTile.value * 2;
              score += value;
              newTiles[previousTile.id as string] = { ...previousTile, value };
              newTiles[tileId] = { ...currentTile, position: [newX + 1, y] };
              previousTile = undefined;
              hasChanged = true;
              continue;
            }

            newBoard[y][newX] = tileId;
            newTiles[tileId] = { ...state.tiles[tileId], position: [newX, y] };
            previousTile = newTiles[tileId];
            if (!isEqual(currentTile.position, [newX, y])) {
              hasChanged = true;
            }
            newX--;
          }
        }
      }
      return {
        ...state,
        isGameOver: checkIsGameOver(state.board, newBoard, newTiles),
        board: newBoard,
        tiles: newTiles,
        hasChanged,
        score,
      };
    }
    default:
      return state;
  }
}
