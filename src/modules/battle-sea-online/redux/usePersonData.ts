import { useAppSelector } from "./hooks";
import { selectRivalData } from "./rivalSlice";
import { selectUserData } from "./userSlice";

export function usePersonData(isRival: boolean) {
  return useAppSelector(isRival ? selectRivalData : selectUserData);
}
