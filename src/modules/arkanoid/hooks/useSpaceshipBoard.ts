import { useReducer, Dispatch } from "react";
import { BoardShape } from "../../../types";
import { getEmptyBoard } from "./helpers";

type BoardState = {
  board: BoardShape;
  spaceship: number[][];
  ball: number[];
};

const START_SPACESHIP = [
  [12, 5],
  [12, 6],
  [12, 7],
];
const START_BALL = [11, 6];

export function useSpaceshipBoard(): [BoardState, Dispatch<Action>] {
  const [boardState, dispatchBoardState] = useReducer(
    boardReducer,
    {
      board: [],
      spaceship: START_SPACESHIP,
      ball: START_BALL,
    },
    (emptyState) => {
      const state = {
        ...emptyState,
        board: getEmptyBoard(),
      };
      return state;
    }
  );

  return [boardState, dispatchBoardState];
}

type Action = {
  type: "start" | "shipMove" | "ballMove";
  newBoard?: BoardShape;
  row?: number;
  column?: number;
  isLast?: boolean;
};

function boardReducer(state: BoardState, action: Action): BoardState {
  let newState = { ...state };

  switch (action.type) {
    case "start":
      return {
        board: getEmptyBoard(),
        spaceship: START_SPACESHIP,
        ball: START_BALL,
      };
    case "shipMove":
      newState.spaceship = state.spaceship.map((dot) => {
        return [dot[0], dot[1] + (action?.column || 0)];
      });
      break;
    case "ballMove":
      newState.ball = [
        action?.row || state.ball[0],
        action?.column || state.ball[1],
      ];
      break;
    // case "move":
    //   const newRow = state.snakesHeadRow + (action.row || 0);
    //   const newColumn = state.snakesHeadColumn + (action.column || 0);

    //   const newSnake = [...state.snake];
    //   newSnake.push([newRow, newColumn]);
    //   newSnake.shift();
    //   newState.snake = newSnake;
    //   newState.snakesHeadRow = newRow;
    //   newState.snakesHeadColumn = newColumn;

    //   break;
    // case "eat":
    //   const newEatedSnake = action.snake || state.snake;
    //   return {
    //     board: getBoardWithFood(newEatedSnake),
    //     ...getSnakeData(newEatedSnake),
    //   };
    default:
      const unhandledType: string = action.type;
      throw new Error(`Unhandled action type: ${unhandledType}`);
  }

  return newState;
}
