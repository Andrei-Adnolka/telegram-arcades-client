import { ReactNode, useContext, createContext } from "react";

import { State, useBattleSeaState } from "../components/game-page/hooks";
import { ISetShip, IShip, PERSON } from "../components/game-page/types";

export const Context = createContext({
  state: {} as State,
  actions: {} as {
    updateShipsLocationState: (person: PERSON) => void;
    checkShoot: (person: PERSON, cell: number) => void;
    addShip: (person: PERSON, ship: IShip) => void;
    resetShips: () => void;
    setRandomShips: () => void;
    resetGameShips: () => void;
    addNotAllowed: (person: PERSON, notAllowed: number[]) => void;
    addNewShips: (ships: IShip[]) => void;
  },
});

export const СontextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatchState] = useBattleSeaState();
  const { sound } = state;
  // const { sound } = useAppSelector((state) => state.appSettingsSlice);

  const updateShipsLocationState = (person: PERSON) => {
    dispatchState({ type: "updateShipsState", person });
  };

  const checkShoot = (person: PERSON, cell: number) => {
    dispatchState({ type: "addShoot", person, cell, sound });
  };

  const addShip = (person: PERSON, ship: IShip) => {
    dispatchState({ type: "addShip", person, ship });
  };
  const addNewShips = (ships: IShip[]) => {
    dispatchState({ type: "addNewShips", ships });
  };

  const resetShips = () => {
    dispatchState({ type: "resetShips" });
  };

  const setRandomShips = () => {
    dispatchState({ type: "setRandomUserShips" });
  };

  const resetGameShips = () => {
    dispatchState({ type: "resetGameShips" });
  };

  const addNotAllowed = (person: PERSON, notAllowed: number[]) => {
    dispatchState({ type: "addNotAllowed", person, notAllowed });
  };

  const values = {
    state,
    actions: {
      updateShipsLocationState,
      checkShoot,
      addShip,
      addNewShips,
      resetShips,
      setRandomShips,
      resetGameShips,
      addNotAllowed,
    },
  };
  const isClient = typeof window !== "undefined";
  if (!isClient) return null;

  return <Context.Provider value={values}>{children}</Context.Provider>;
};

// export const useStateContext = () => useContextSelector(Context, (v) => v);

export const useStateContext = () => useContext(Context);

export const useStateContextState = () => {
  const data = useContext(Context);
  return data.state;
};
export const usePersonContextData = (person: PERSON) => {
  const state = useStateContextState();
  return state[person];
};
export const useStateContextStateDnd = () => {
  return useStateContextState().shipDnD;
};
export const useStateContextActions = () => {
  const data = useContext(Context);
  return data.actions;
};

// export const useSelectMapStateValueByKey = (key: Keys) =>
//   // @ts-ignore
//   useContextSelector(Context, (v) => v[0]?.[key]);

// export const useMapSetStateContext = () =>
//   // @ts-ignore
//   useContextSelector(Context, (v) => v[1]);

// // export const useSetStateWithPrevContext = () => {
// //   const setState = useMapSetStateContext();

// //   return (key: Keys, value: boolean | string[] | number[]) => {
// //     setState((prev: MapContextState) => ({ ...prev, [key]: value }));
// //   };
// // };
