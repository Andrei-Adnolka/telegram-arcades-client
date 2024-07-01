import { useReducer, Dispatch } from "react";
import { BoardShape, SnakeShape } from "../../../types";
import { getSnakeData, getBoardWithFood } from "./helpers";

type BoardState = {
  board: BoardShape;
  snakesHeadRow: number;
  snakesHeadColumn: number;
  snake: number[][];
};

const START_SNAKE = [
  [1, 1],
  [1, 2],
];

export function useSnakeBoard(): [BoardState, Dispatch<Action>] {
  const [boardState, dispatchBoardState] = useReducer(
    boardReducer,
    {
      board: [],
      snakesHeadRow: 0,
      snakesHeadColumn: 0,
      snake: [[0], [1]],
    },
    (emptyState) => {
      const state = {
        ...emptyState,
        board: getBoardWithFood(),
      };
      return state;
    }
  );

  return [boardState, dispatchBoardState];
}

type Action = {
  type: "start" | "eat" | "move" | "setState";
  newBoard?: BoardShape;
  row?: number;
  column?: number;
  snake?: SnakeShape;
  board?: BoardShape;
};

function boardReducer(state: BoardState, action: Action): BoardState {
  let newState = { ...state };

  switch (action.type) {
    case "start":
      return {
        board: getBoardWithFood(START_SNAKE),
        ...getSnakeData(START_SNAKE),
      };
    case "move":
      const newRow = state.snakesHeadRow + (action.row || 0);
      const newColumn = state.snakesHeadColumn + (action.column || 0);

      const newSnake = [...state.snake];
      newSnake.push([newRow, newColumn]);
      newSnake.shift();
      newState.snake = newSnake;
      newState.snakesHeadRow = newRow;
      newState.snakesHeadColumn = newColumn;

      break;
    case "eat":
      const newEatedSnake = action.snake || state.snake;
      return {
        board: getBoardWithFood(newEatedSnake),
        ...getSnakeData(newEatedSnake),
      };
    case "setState":
      return {
        board: action.board || [],
        ...getSnakeData(action.snake || []),
      };
    default:
      const unhandledType: string = action.type;
      throw new Error(`Unhandled action type: ${unhandledType}`);
  }

  return newState;
}
