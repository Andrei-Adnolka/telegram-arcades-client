import { useReducer, Dispatch } from "react";

import { BoardShape } from "../../../types";
import { getEmptyBoard, isCollision } from "./helpers";

type BoardState = {
  board: BoardShape;
  space: number[];
  army: number[][];
  bullets: number[][];

  score: number;
  isGameOver: boolean;
};

const getStartArmyRow = () => generateArray(9, 9).map((el) => [0, el]);

export function useShotBoard(): [BoardState, Dispatch<Action>] {
  const [boardState, dispatchBoardState] = useReducer(
    boardReducer,
    {
      space: [15, 5],
      army: getStartArmyRow(),
      bullets: [],
      score: 0,
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
  type: "start" | "spaceMove" | "armyMove" | "spaceFire" | "bulletsMove";
  isLeft?: boolean;
  bullets?: number[][];
};

const generateArray = (length: number, max: number) => {
  const array = [...new Array(length)].map(() =>
    Math.round(Math.random() * max)
  );
  const uniqueItems = new Set(array);
  return Array.from(uniqueItems);
};

// @ts-ignore
function isEqual(a, b) {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  return keysA.length === keysB.length && keysA.every((n) => a[n] === b[n]);
}

function getUniqBullets(bullets: number[][]) {
  const unigBullets = [] as number[][];
  let uniqIds = {} as Record<string, string>;

  bullets.forEach((bullet) => {
    const key = `${bullet[0]}_${bullet[1]}`;
    if (!uniqIds[key]) {
      uniqIds[key] = "1";
      unigBullets.push(bullet);
    }
  });

  return unigBullets;
}

function boardReducer(state: BoardState, action: Action): BoardState {
  let newState = { ...state };

  switch (action.type) {
    case "start":
      return {
        board: getEmptyBoard(),
        space: [15, 5],
        army: getStartArmyRow(),
        bullets: [],
        score: 0,
        isGameOver: false,
      };
    case "spaceMove":
      if (!isCollision(state.space, action.isLeft)) {
        break;
      }
      const [spaceRow, spaceColumn] = state.space;

      newState.space = [
        spaceRow,
        action.isLeft ? spaceColumn - 1 : spaceColumn + 1,
      ];
      break;
    case "spaceFire":
      newState.bullets = getUniqBullets([...state.bullets, state.space]);
      break;
    case "bulletsMove":
      const newBullets = state.bullets
        .map(([row, column]) => [row - 1, column])
        .filter(([row]) => row >= 0);

      const newBulletsAfterKill = newBullets.filter((n) =>
        state.army.every((m) => !isEqual(n, m))
      );

      const newArmy = state.army.filter((n) =>
        newBullets.every((m) => !isEqual(n, m))
      );
      newState.score =
        (newBullets.length - newBulletsAfterKill.length) * 10 + state.score;
      newState.bullets = newBulletsAfterKill;
      newState.army = newArmy;
      break;
    case "armyMove": {
      const updatedArmy = state.army.map(([row, column]) => [row + 1, column]);
      newState.army = [...updatedArmy, ...getStartArmyRow()];
      break;
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }

  return newState;
}
