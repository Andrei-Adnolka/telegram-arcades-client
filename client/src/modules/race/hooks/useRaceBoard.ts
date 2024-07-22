import { useReducer, Dispatch } from "react";

import { BoardShape } from "../../../types";
import { getEmptyBoard, BOARD_WIDTH } from "./helpers";

type BoardState = {
  board: BoardShape;
  car: number[][];
  leftBoard: number[][];
  rightBoard: number[][];

  otherCars: number[][][];
  newCarPosition: number[][];
  isCrash: boolean;
  crashBlock: number[][];
  score: number;
};

const START_CAR = [
  [12, 5],

  [13, 4],
  [13, 5],
  [13, 6],

  [14, 5],

  [15, 4],
  [15, 6],
];

const LEFT_CAR = [[1, 3], [2], [1, 2, 3], [2]];
const CENTR_CAR = [[4, 6], [5], [4, 5, 6], [5]];
const RIGHT_CAR = [[7, 9], [8], [7, 8, 9], [8]];

const getNewOtherCar = () =>
  [LEFT_CAR, CENTR_CAR, RIGHT_CAR][Math.floor(Math.random() * 3)];

const getBoardsPart = (isLeft = false) => {
  return [1, 2, 5, 6, 9, 10, 13, 14].map((el) => {
    return [el, isLeft ? 0 : 10];
  });
};

const moveBoardsPart = (part: number[][]) =>
  part.map((el) => [el[0] === 15 ? 0 : el[0] + 1, el[1]]);

// for check collisions
const getRightAndLeftDots = (car: number[][]) => {
  const rightDot = car[car.length - 1][1];
  const leftDot = rightDot - 2;
  const centralDot = rightDot - 1;
  return { rightDot, leftDot, centralDot };
};

const updatedCarForCheckingCollisions = (cars: number[][]) => {
  const { leftDot, rightDot, centralDot } = getRightAndLeftDots(cars);

  return cars.reduce((acc, next) => {
    const row = next[0];
    const column = next[1];
    let newParts = [];
    if (column !== leftDot) {
      newParts.push([row, leftDot]);
    }
    if (column !== centralDot) {
      newParts.push([row, centralDot]);
    }
    if (column !== rightDot) {
      newParts.push([row, rightDot]);
    }
    return [...acc, next, ...newParts];
  }, [] as number[][]);
};
const checkCollisionsWithOtherCars = (
  cars: number[][],
  otherCars: number[][][]
) => {
  let otherCar = [] as number[][];

  updatedCarForCheckingCollisions(cars).forEach((car) => {
    otherCars.forEach((el) => {
      return el.forEach((inside) => {
        if (
          !otherCar.length &&
          JSON.stringify(car) === JSON.stringify(inside)
        ) {
          otherCar = el;
        }
      });
    });
  });
  return otherCar;
};

const isCollision = (car: number[][], isLeft?: boolean) => {
  const { rightDot, leftDot } = getRightAndLeftDots(car);

  return isLeft ? leftDot === 1 : rightDot === BOARD_WIDTH - 2;
};

const getNewOtherCars = (
  otherCars: number[][][],
  newCarPosition: number[][]
) => {
  let newOtherCars = [] as number[][][];
  otherCars.forEach((cars, i) => {
    const positions = newCarPosition;

    const newCars = cars.reduce((acc, next, index) => {
      const newRow = next[0] + 1;
      if (newRow > 15) {
        return acc;
      }
      const newPart = [newRow, next[1]];
      if (cars.length - 1 === index && positions[cars[0][0] + 1]) {
        const carsPart = positions[cars[0][0] + 1].map((el) => [next[0], el]);
        return [...acc, newPart, ...carsPart];
      }

      return [...acc, newPart];
    }, [] as number[][]);
    newOtherCars[i] = newCars;
  });
  return newOtherCars;
};

export function useRaceBoard(): [BoardState, Dispatch<Action>] {
  const [boardState, dispatchBoardState] = useReducer(
    boardReducer,
    {
      board: [],
      car: START_CAR,
      otherCars: [],
      leftBoard: getBoardsPart(true),
      rightBoard: getBoardsPart(),
      newCarPosition: [],
      isCrash: false,
      crashBlock: [],
      score: 0,
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
  type: "start" | "carMove" | "boardsMove" | "createCar" | "otherCarsMove";
  isLeft?: boolean;
};

function boardReducer(state: BoardState, action: Action): BoardState {
  let newState = { ...state };

  switch (action.type) {
    case "start":
      return {
        board: getEmptyBoard(),
        car: START_CAR,
        otherCars: [],
        leftBoard: getBoardsPart(true),
        rightBoard: getBoardsPart(),
        newCarPosition: [],
        crashBlock: [],
        isCrash: false,
        score: 0,
      };
    case "carMove":
      if (isCollision(state.car, action.isLeft)) {
        break;
      }

      const newCar = state.car.map((dot) => {
        const column = action.isLeft ? dot[1] - 3 : dot[1] + 3;
        return [dot[0], column];
      });

      const collisionCar = checkCollisionsWithOtherCars(
        newCar,
        state.otherCars
      );
      const isCrash = !!collisionCar.length;
      newState.isCrash = isCrash;
      newState.crashBlock = isCrash ? [...collisionCar, ...state.car] : [];
      newState.car = newCar;
      break;
    case "otherCarsMove": {
      if (state.otherCars.length) {
        let newOtherCars = getNewOtherCars(
          state.otherCars,
          state.newCarPosition
        );
        const collisionCar = checkCollisionsWithOtherCars(
          state.car,
          newOtherCars
        );
        const isCrash = !!collisionCar.length;
        newState.isCrash = isCrash;
        newState.crashBlock = isCrash ? [...collisionCar, ...state.car] : [];
        newState.otherCars = newOtherCars.filter((el) => {
          if (!el.length) {
            newState.score = state.score + 100;
            return false;
          }
          return true;
        });
      }
      break;
    }
    case "createCar":
      {
        newState.newCarPosition = [] as number[][];

        const parts = getNewOtherCar();
        const carsPart = parts[0].map((el) => [0, el]);
        newState.newCarPosition = parts;
        newState.otherCars = [...state.otherCars, [...carsPart]];
      }
      break;
    case "boardsMove":
      newState.leftBoard = moveBoardsPart(state.leftBoard);
      newState.rightBoard = moveBoardsPart(state.rightBoard);
      break;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }

  return newState;
}
