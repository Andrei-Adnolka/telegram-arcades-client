import { useReducer, Dispatch } from "react";

type State = {
  status: "game-over" | "playing" | "stopped";
  x: number;
  y: number;
  r: number;
  score: number;
  pipes: { topHeight: number; id: number }[];
  prevIds: number[];
};

export function useFlappyBoard(): [State, Dispatch<Action>] {
  const [boardState, dispatchBoardState] = useReducer(
    boardReducer,
    {
      status: "stopped",
      y: 250,
      r: 0,
      x: 300,
      pipes: [],
      score: 0,
      prevIds: [],
    }
    // (emptyState) => {
    //   const state = { ...emptyState };
    //   return state;
    // }
  );

  return [boardState, dispatchBoardState];
}

type Action = {
  type:
    | "start"
    | "fly"
    | "fall"
    | "running"
    | "generate"
    | "gameOver"
    | "setScore"
    | "setPrevId";
  id?: number;
};

function boardReducer(state: State, action: Action): State {
  let newState = { ...state };

  switch (action.type) {
    case "start":
      newState.status = "playing";
      break;
    case "running":
      if (!state.pipes.length) return state;

      newState.x = state.x - 10;
      break;
    case "fly":
      newState.r = -30;
      newState.y = state.y - 50;
      break;
    case "fall":
      newState.y = state.y + 20;
      newState.r = 0;
      break;
    case "setScore":
      newState.score = state.score + 1;
      break;
    case "setPrevId":
      newState.prevIds = [...state.prevIds, action.id as number];
      break;
    case "gameOver":
      newState.y = 250;
      newState.r = 0;
      newState.x = 300;
      newState.pipes = [];
      newState.status = "stopped";
      break;
    case "generate":
      const topHeight = Math.round(Math.random() * 200) + 40;
      newState.pipes = [
        ...state.pipes,
        { topHeight, id: Math.round(Math.random() * 1000) },
      ];
      break;
    default:
      const unhandledType: string = action.type;
      throw new Error(`Unhandled action type: ${unhandledType}`);
  }

  return newState;
}
