import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useReducer,
} from "react";
import isNil from "lodash/isNil";
import throttle from "lodash/throttle";
import {
  mergeAnimationDuration,
  tileCountPerDimension,
  STORAGE_NAME,
} from "../constants";
import { Tile } from "../models/tile";
import gameReducer, { initialState, State } from "../reducers/game-reducer";
import { useLocalStorage } from "../../../hooks/useLocalStorage";

type MoveDirection = "move_up" | "move_down" | "move_left" | "move_right";

export const GameContext = createContext({
  score: 0,
  moveTiles: (_: MoveDirection) => {},
  getTiles: () => [] as Tile[],
  startGame: () => {},
  setOldState: (_: State) => {},
});

export default function GameProvider({ children }: PropsWithChildren) {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  const { setItem } = useLocalStorage(STORAGE_NAME);

  const getEmptyCells = () => {
    const results: [number, number][] = [];

    for (let x = 0; x < tileCountPerDimension; x++) {
      for (let y = 0; y < tileCountPerDimension; y++) {
        if (isNil(gameState.board[y][x])) {
          results.push([x, y]);
        }
      }
    }
    return results;
  };

  const appendRandomTile = () => {
    const emptyCells = getEmptyCells();
    if (emptyCells.length > 0) {
      const cellIndex = Math.floor(Math.random() * emptyCells.length);
      const newTile = {
        position: emptyCells[cellIndex],
        value: 2,
      };
      dispatch({ type: "create_tile", tile: newTile });
    }
  };

  const getTiles = () => {
    return gameState.tilesByIds.map((tileId) => gameState.tiles[tileId]);
  };

  const setOldState = (state: State) => {
    dispatch({ type: "set_state", state });
  };

  // eslint-disable-next-line
  const moveTiles = useCallback(
    throttle(
      (type: MoveDirection) => dispatch({ type }),
      mergeAnimationDuration * 1.05,
      { trailing: false }
    ),
    [dispatch]
  );

  const startGame = () => {
    dispatch({ type: "create_tile", tile: { position: [0, 1], value: 2 } });
    dispatch({ type: "create_tile", tile: { position: [0, 2], value: 2 } });
  };

  useEffect(() => {
    if (gameState.hasChanged) {
      setTimeout(() => {
        dispatch({ type: "clean_up" });
        appendRandomTile();
      }, mergeAnimationDuration);
      setItem(gameState);
    }
    // eslint-disable-next-line
  }, [gameState.hasChanged]);

  return (
    <GameContext.Provider
      value={{
        score: gameState.score,
        getTiles,
        moveTiles,
        startGame,
        setOldState,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
