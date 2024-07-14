import { useReducer, Dispatch } from "react";
import { BoardShape } from "../../../types";
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  Directions,
  getEmptyBoard,
  getNewBallPosition,
} from "./helpers";

type BoardState = {
  board: BoardShape;
  spaceship: number[][];
  ball: number[];
  ballDirection: Directions;
  isGameOver: boolean;
};

const START_SPACESHIP = [
  [15, 3],
  [15, 4],
  [15, 5],
];
const START_BALL = [14, 4];

export function useSpaceshipBoard(): [BoardState, Dispatch<Action>] {
  const [boardState, dispatchBoardState] = useReducer(
    boardReducer,
    {
      board: [],
      spaceship: START_SPACESHIP,
      ball: START_BALL,
      ballDirection: Directions.RightTop,
      isGameOver: false,
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
  isLeft?: boolean;
  isBallStarted?: boolean;
};

function boardReducer(state: BoardState, action: Action): BoardState {
  let newState = { ...state };

  switch (action.type) {
    case "start":
      return {
        board: getEmptyBoard(),
        spaceship: START_SPACESHIP,
        ball: START_BALL,
        ballDirection: Directions.RightTop,
        isGameOver: false,
      };
    case "shipMove":
      let isCollisionWithBoard = false;
      const newSpaceship = state.spaceship.map((dot) => {
        const newColumn = action.isLeft ? dot[1] - 1 : dot[1] + 1;
        if (newColumn === BOARD_WIDTH || newColumn === -1) {
          isCollisionWithBoard = true;
        }
        return [dot[0], newColumn];
      });
      if (isCollisionWithBoard) {
        break;
      }
      newState.spaceship = newSpaceship;
      if (!action.isBallStarted) {
        newState.ball = [
          state.ball[0],
          action.isLeft ? state.ball[1] - 1 : state.ball[1] + 1,
        ];
      }
      break;
    case "ballMove":
      let [row, column] = state.ball;
      let newDirection = "" as Directions;

      if (row === 0 && (column === 0 || column === BOARD_WIDTH - 1)) {
        if (state.ballDirection === Directions.RightTop) {
          newDirection = Directions.LeftBottom;
        }
        if (state.ballDirection === Directions.LeftTop) {
          newDirection = Directions.RightBottom;
        }
        newState.ball = getNewBallPosition(
          state.ball,
          newDirection || state.ballDirection
        );
        if (newDirection) {
          newState.ballDirection = newDirection;
        }
        break;
      }

      if (row === 0) {
        newDirection =
          state.ballDirection === Directions.RightTop
            ? Directions.RightBottom
            : Directions.LeftBottom;
      }
      if (column === BOARD_WIDTH - 1) {
        newDirection =
          state.ballDirection === Directions.RightBottom
            ? Directions.LeftBottom
            : Directions.LeftTop;
      }
      if (column === 0) {
        newDirection =
          state.ballDirection === Directions.LeftBottom
            ? Directions.RightBottom
            : Directions.RightTop;
      }

      let isTouchSpacehips = false;
      state.spaceship.forEach((el) => {
        if (JSON.stringify(state.ball) === JSON.stringify(el)) {
          isTouchSpacehips = true;
        }
      });

      if (isTouchSpacehips) {
        if (state.ballDirection === Directions.RightBottom) {
          newDirection = Directions.RightTop;
        }
        if (state.ballDirection === Directions.LeftBottom) {
          newDirection = Directions.LeftTop;
        }
      }
      const newBall = getNewBallPosition(
        state.ball,
        newDirection || state.ballDirection
      );
      if (newBall[0] === BOARD_HEIGHT) {
        state.isGameOver = true;
        break;
      }

      newState.ball = newBall;
      if (newDirection) {
        newState.ballDirection = newDirection;
      }
      break;
    default:
      const unhandledType: string = action.type;
      throw new Error(`Unhandled action type: ${unhandledType}`);
  }

  return newState;
}
