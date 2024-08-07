import { IShip } from "../components/game-page/types";
import { useAppDispatch, useAppSelector } from "./hooks";
import { rivalSlice, selectRivalData } from "./rivalSlice";
import { userSlice, selectUserData } from "./userSlice";

export function usePersonData(isRival: boolean) {
  return useAppSelector(isRival ? selectRivalData : selectUserData);
}

export function usePersonActionsData(isRival: boolean) {
  const dispatch = useAppDispatch();
  const actions = isRival ? rivalSlice.actions : userSlice.actions;

  const sendMisses = (cell: number) => {
    dispatch(actions.sendMisses(cell));
  };

  const sendNewShips = (ships: IShip[]) => {
    dispatch(actions.addNewShips(ships));
  };

  return { sendNewShips, sendMisses };
}
