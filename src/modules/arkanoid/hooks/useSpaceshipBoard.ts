import { useReducer, Dispatch } from "react";
import { BoardShape } from "../../../types";
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  getEmptyBoard,
  getNewBallPosition,
  getTouchBricks,
} from "./helpers";
import { BRIKS_LEVELS } from "./constants";

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
  levelData: {
    index: number;
    level: number;
    speed: number;
    bricksState: number[][];
  };
  updatedBoardBlocks: number[][];
  isLeftFire: boolean | null;
};

const START_SPACESHIP = [
  [16, 3],
  [16, 4],
  [16, 5],
  [16, 6],
];
const START_BALL = [15, 4];

export const LEVELS = [
  { index: 0, level: 1, speed: 300, bricksState: BRIKS_LEVELS[0] },
  { index: 1, level: 2, speed: 250, bricksState: BRIKS_LEVELS[1] },
  { index: 2, level: 3, speed: 200, bricksState: BRIKS_LEVELS[2] },
  { index: 3, level: 4, speed: 180, bricksState: BRIKS_LEVELS[3] },
  { index: 4, level: 5, speed: 160, bricksState: BRIKS_LEVELS[0] },
  { index: 5, level: 6, speed: 140, bricksState: BRIKS_LEVELS[1] },
  { index: 6, level: 7, speed: 120, bricksState: BRIKS_LEVELS[2] },
  { index: 7, level: 8, speed: 100, bricksState: BRIKS_LEVELS[3] },
  { index: 8, level: 9, speed: 80, bricksState: BRIKS_LEVELS[0] },
];

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
      bricks: LEVELS[0].bricksState,
      score: 0,
      lives: 4,
      levelData: LEVELS[0],
      updatedBoardBlocks: [],
      isLeftFire: null,
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

const findBallNewPosition = (spaceship: number[][]) => [
  spaceship[1][0] - 1,
  spaceship[1][1],
];

type Action = {
  type: "start" | "shipMove" | "ballMove" | "startBall" | "setIsLeftFire";
  newBoard?: BoardShape;
  row?: number;
  column?: number;
  isLeft?: boolean;
  isBallStarted?: boolean;
  bricks?: number[][];
  isLeftFire?: boolean | null;
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
        bricks: LEVELS[0].bricksState,
        score: 0,
        lives: 4,
        levelData: LEVELS[0],
        updatedBoardBlocks: [],
        isLeftFire: null,
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
    case "setIsLeftFire": {
      newState.isLeftFire = null;
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
        newState.isBallStarted = false;
        newState.lives = newLifes;
        newState.isLeftFire = newBall[1] < 5;
        newState.spaceship = [];
        newState.ball = [];
        setTimeout(() => {
          newState.spaceship = START_SPACESHIP;
          newState.ball = START_BALL;
        }, 2000);
        if (newLifes === 0) {
          newState.isLeftFire = true;
          setTimeout(() => {
            newState.isGameOver = true;
          }, 2000);
        }
        break;
      }

      if (!newBricks.length) {
        state.isBallStarted = false;
        const newLevel = LEVELS[state.levelData.index + 1];
        newState.bricks = newLevel.bricksState;
        newState.levelData = newLevel;
        newState.spaceship = START_SPACESHIP;
        newState.ball = START_BALL;
        break;
      } else {
        newState.bricks = newBricks;
      }

      newState.score = state.score + score;
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
