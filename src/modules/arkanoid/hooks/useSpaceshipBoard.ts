import { useReducer, Dispatch } from "react";
import { BoardShape } from "../../../types";
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  getEmptyBoard,
  getNewBallPosition,
  getTouchBricks,
} from "./helpers";
import { FIRST_LEVEL } from "./constants";

type BoardState = {
  board: BoardShape;
  spaceship: number[][];
  ball: number[];
  isGameOver: boolean;
  isBallStarted: boolean;
  bricks: number[][];
  score: number;
  ballTop: number;
  ballRight: number;
  lives: number;
};

const START_SPACESHIP = [
  [16, 3],
  [16, 4],
  [16, 5],
  [16, 6],
];
const START_BALL = [15, 4];

export function useSpaceshipBoard(): [BoardState, Dispatch<Action>] {
  const [boardState, dispatchBoardState] = useReducer(
    boardReducer,
    {
      board: [],
      spaceship: START_SPACESHIP,
      ball: START_BALL,
      isGameOver: false,
      isBallStarted: false,
      ballTop: -1,
      ballRight: 1,
      bricks: FIRST_LEVEL,
      score: 0,
      lives: 4,
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
  type: "start" | "shipMove" | "ballMove" | "startBall";
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
        ballTop: -1,
        ballRight: -1,
        isGameOver: false,
        isBallStarted: false,
        bricks: FIRST_LEVEL,
        score: 0,
        lives: 4,
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
    case "startBall": {
      newState.isBallStarted = true;
      break;
    }
    case "ballMove":
      let [row, column] = state.ball;
      let newBallTop = state.ballTop;
      let newBallRight = state.ballRight;

      if (row === 0 && (column === 0 || column === BOARD_WIDTH - 1)) {
        newBallRight *= -1;
        newBallTop *= -1;

        newState.ball = getNewBallPosition(
          state.ball,
          newBallTop,
          newBallRight
        );
        newState.ballTop = newBallTop;
        newState.ballRight = newBallRight;
        break;
      }

      if (column === BOARD_WIDTH - 1 || column === 0) {
        newBallRight *= -1;
      }

      const { isTouchRowBricks, isTouchColumnBricks, newBricks, score } =
        getTouchBricks(state.ball, state.bricks, newBallTop, newBallRight);

      if (isTouchRowBricks || row === 0) {
        newBallTop *= -1;
      }
      if (isTouchColumnBricks) {
        newBallRight *= -1;
      }

      let isTouchSpacehips = false;

      state.spaceship.forEach((el, index, array) => {
        if (!isTouchSpacehips) {
          const newBall = getNewBallPosition(
            state.ball,
            newBallTop,
            newBallRight
          );
          if (JSON.stringify(newBall) === JSON.stringify(el)) {
            newBallTop *= -1;
            if (
              (index === 0 && newBallRight === 1) ||
              (array.length - 1 === index && newBallRight === -1)
            ) {
              newBallRight *= -1;
            }
          }
        }
      });

      const newBall = getNewBallPosition(state.ball, newBallTop, newBallRight);

      if (newBall[0] === BOARD_HEIGHT) {
        const newLifes = state.lives - 1;
        state.isBallStarted = false;
        newState.lives = newLifes;
        const spaceshipPosition = state.spaceship[1];
        newState.ball = [spaceshipPosition[0] - 1, spaceshipPosition[1]];
        if (newLifes === 0) {
          state.isGameOver = true;
        }
        break;
      }

      newState.score = state.score + score;
      newState.bricks = newBricks;
      newState.ball = newBall;
      newState.ballTop = newBallTop;
      newState.ballRight = newBallRight;
      break;
    default:
      const unhandledType: string = action.type;
      throw new Error(`Unhandled action type: ${unhandledType}`);
  }

  return newState;
}
