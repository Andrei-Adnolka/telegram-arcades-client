import { useReducer, Dispatch, useMemo } from "react";

import { IPlayerState, IShip, PERSON } from "../types";
import Sound from "../API/Sound/Sound";
import { SHIPS } from "../constants";
import { getCorrectShip } from "../API/ShipsPlacer/ShipsPlacer";

export type State = {
  user: IPlayerState;
  rival: IPlayerState;
  sound: boolean;
};

const initialPersonsState = {
  user: {
    ships: [],
    misses: [],
    notAllowed: [],
  },
  rival: {
    ships: [],
    misses: [],
    notAllowed: [],
  },
};

export function useBattleSeaState(): [State, Dispatch<Action>] {
  const [state, dispatchState] = useReducer(boardReducer, {
    ...initialPersonsState,
    sound: true,
  });

  return useMemo(() => [state, dispatchState], [state]);
}

type ShipsTypes =
  | "addShip"
  | "addShoot"
  | "addMiss"
  | "setRandomUserShips"
  | "addNotAllowed"
  | "resetShips"
  | "resetGameShips"
  | "updateShipsState"
  | "addNewShips";

type ShipsActions = {
  person?: PERSON;
  ship?: IShip;
  cell?: number;
  sound?: boolean;
  ships?: IShip[];
  notAllowed?: number[];
};

type ShipActions = {
  decks?: number | null;
  isHorizontal?: boolean;
  isDropped?: boolean;
};

type Action = {
  type: ShipsTypes;
} & ShipsActions &
  ShipActions;

function boardReducer(state: State, action: Action): State {
  let newState = { ...state };
  switch (action.type) {
    case "addShip":
      if (action.person && action.ship) {
        const person = action.person;
        let isIncludeShip = false;
        action.ship.shipLocation.forEach((position) => {
          if (!isIncludeShip) {
            newState[person].ships.forEach((ship) => {
              isIncludeShip = ship.shipLocation.includes(position);
            });
          }
        });
        if (!isIncludeShip) {
          const newShips = [...state[action.person].ships, action.ship];
          newState[person].ships = newShips;
        }
      }
      break;
    case "addNewShips":
      if (action.ships) {
        state.user.ships = action.ships;
      }
      break;
    case "addShoot":
      //@ts-ignore
      const ships = state[action.person].ships.map((ship) => ship.shipLocation);
      //@ts-ignore
      const index = ships.findIndex((coordinates) =>
        coordinates.includes(action.cell)
      );
      if (index !== -1) {
        if (action.sound) {
          Sound("shot");
        }
        //@ts-ignore
        newState[action.person].ships[index].woundedCells.push(action.cell);
      } else {
        if (action.sound) {
          Sound("bulk");
        }
        //@ts-ignore
        newState[action.person].misses.push(action.cell);
      }
      break;
    case "addMiss":
      //@ts-ignore
      newState[action.person].misses.push(action.cell);
      break;
    case "resetShips":
      newState.user.ships = [];
      break;
    case "resetGameShips":
      newState.user = initialPersonsState.user;
      newState.rival = initialPersonsState.rival;
      break;
    case "updateShipsState":
      //@ts-ignore
      newState[action.person] = action.state;
      break;
    case "setRandomUserShips":
      const newShips: IShip[] = [];
      SHIPS.forEach((ship) => {
        getCorrectShip([], newShips, ship);
      });
      newState.user.ships = newShips;
      break;
    case "addNotAllowed":
      //@ts-ignore
      state[action.person].notAllowed.push(...(action.notAllowed || []));
      break;
    default:
      const unhandledType: string = action.type;
      throw new Error(`Unhandled action type: ${unhandledType}`);
  }

  return newState;
}
