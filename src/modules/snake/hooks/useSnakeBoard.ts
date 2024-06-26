import { useReducer, Dispatch } from "react";
import { BoardShape, EmptyCell, FoodCell, SnapeShape } from "../../../types";

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 16;

type BoardState = {
  board: BoardShape;
  snakesHeadRow: number;
  snakesHeadColumn: number;
  snake: number[][];
  food: number[];
};

export function getEmptyBoard(
  height = BOARD_HEIGHT,
  food?: number[]
): BoardShape {
  return Array(height)
    .fill(null)
    .map((_, heightIndex) => {
      const array = Array(BOARD_WIDTH).fill(EmptyCell.Empty);
      if (!food || heightIndex !== food[0]) {
        return array;
      }
      array[food[1]] = "Food";
      return array;
    });
}

export function useSnakeBoard(): [BoardState, Dispatch<Action>] {
  const [boardState, dispatchBoardState] = useReducer(
    boardReducer,
    {
      board: [],
      snakesHeadRow: 0,
      snakesHeadColumn: 0,
      snake: [[0], [1]],
      food: [],
    },
    (emptyState) => {
      const state = {
        ...emptyState,
        board: getEmptyBoard(BOARD_HEIGHT),
      };
      return state;
    }
  );

  return [boardState, dispatchBoardState];
}

export function getRandomFood(): [number, number] {
  const row = Math.floor(Math.random() * BOARD_HEIGHT);
  const column = Math.floor(Math.random() * BOARD_WIDTH);
  return [row, column];
}

type Action = {
  type: "start" | "eat" | "move";
  newBoard?: BoardShape;
  row?: number;
  column?: number;
  snake?: SnapeShape;
};

function boardReducer(state: BoardState, action: Action): BoardState {
  let newState = { ...state };

  switch (action.type) {
    case "start":
      const food = getRandomFood();
      return {
        board: getEmptyBoard(BOARD_HEIGHT, food),
        snakesHeadRow: 1,
        snakesHeadColumn: 2,
        food,
        snake: [
          [1, 1],
          [1, 2],
        ],
      };
    case "move":
      const newRow = state.snakesHeadRow + (action.row || 0);
      const newColumn = state.snakesHeadColumn + (action.column || 0);

      if (!hasCollisions(state.board, newRow, newColumn)) {
        const newSnake = [...state.snake];
        newSnake.push([newRow, newColumn]);
        newSnake.shift();
        newState.snake = newSnake;
        newState.snakesHeadRow = newRow;
        newState.snakesHeadColumn = newColumn;
      }
      break;
    case "eat":
      const newSnake = action.snake || state.snake;
      const snakeHead = newSnake[newSnake.length - 1];
      const newFood = getRandomFood();

      return {
        board: getEmptyBoard(BOARD_HEIGHT, newFood),
        snake: newSnake,
        snakesHeadRow: snakeHead[0],
        snakesHeadColumn: snakeHead[1],
        food: newFood,
      };
    default:
      const unhandledType: string = action.type;
      throw new Error(`Unhandled action type: ${unhandledType}`);
  }

  return newState;
}

export function hasCollisions(
  board: BoardShape,
  row: number,
  column: number
): boolean {
  let hasCollision = false;
  if (
    row >= board.length ||
    column >= board[0].length ||
    column < 0 ||
    // @ts-ignore
    ![EmptyCell.Empty, FoodCell.Food].includes(board?.[row]?.[column])
  ) {
    hasCollision = true;
  }
  return hasCollision;
}

export function eating(
  board: BoardShape,
  row: number,
  column: number
): boolean {
  return board?.[row]?.[column] === FoodCell.Food;
}
