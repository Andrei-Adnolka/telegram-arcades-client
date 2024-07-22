import { useReducer, Dispatch } from "react";
import { Block, BlockShape, BoardShape, SHAPES } from "../../../types";
import {
  getEmptyBoard,
  getRandomBlock,
  hasCollisions,
  rotateBlock,
} from "./helpers";
import { BOARD_HEIGHT } from "../constants";

type BoardState = {
  board: BoardShape;
  droppingRow: number;
  droppingColumn: number;
  droppingBlock: Block;
  droppingShape: BlockShape;
};

export function useTetrisBoard(): [BoardState, Dispatch<Action>] {
  const [boardState, dispatchBoardState] = useReducer(
    boardReducer,
    {
      board: [],
      droppingRow: 0,
      droppingColumn: 0,
      droppingBlock: Block.I,
      droppingShape: SHAPES.I.shape,
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
  type: "start" | "drop" | "commit" | "move" | "setState";
  newBoard?: BoardShape;
  newBlock?: Block;
  isPressingLeft?: boolean;
  isPressingRight?: boolean;
  isRotating?: boolean;

  board?: BoardShape;
  droppingRow?: number;
  droppingColumn?: number;
  droppingBlock?: Block;
  droppingShape?: BlockShape;
};

function boardReducer(state: BoardState, action: Action): BoardState {
  let newState = { ...state };

  switch (action.type) {
    case "start":
      const firstBlock = getRandomBlock();
      return {
        board: getEmptyBoard(),
        droppingRow: 0,
        droppingColumn: 3,
        droppingBlock: firstBlock,
        droppingShape: SHAPES[firstBlock].shape,
      };
    case "drop":
      newState.droppingRow++;
      break;
    case "setState":
      newState.board = action.board || newState.board;
      newState.droppingRow = action.droppingRow || newState.droppingRow;
      newState.droppingColumn =
        action.droppingColumn || newState.droppingColumn;
      newState.droppingBlock = action.droppingBlock || newState.droppingBlock;
      newState.droppingShape = action.droppingShape || newState.droppingShape;
      break;
    case "commit":
      return {
        board: [
          ...getEmptyBoard(BOARD_HEIGHT - action.newBoard!.length),
          ...action.newBoard!,
        ],
        droppingRow: 0,
        droppingColumn: 3,
        droppingBlock: action.newBlock!,
        droppingShape: SHAPES[action.newBlock!].shape,
      };
    case "move":
      const rotatedShape = action.isRotating
        ? rotateBlock(newState.droppingShape)
        : newState.droppingShape;
      let columnOffset = action.isPressingLeft ? -1 : 0;
      columnOffset = action.isPressingRight ? 1 : columnOffset;
      if (
        !hasCollisions(
          newState.board,
          rotatedShape,
          newState.droppingRow,
          newState.droppingColumn + columnOffset
        )
      ) {
        newState.droppingColumn += columnOffset;
        newState.droppingShape = rotatedShape;
      }
      break;
    default:
      const unhandledType: never = action.type;
      throw new Error(`Unhandled action type: ${unhandledType}`);
  }

  return newState;
}
