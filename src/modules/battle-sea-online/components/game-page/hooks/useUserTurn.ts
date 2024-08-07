import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { setIsUserShot, setWinner } from "../../../redux/gameSlice";
import { selectRivalData, addNotAllowed } from "../../../redux/rivalSlice";
import { IPlayerState, IShip, PERSON } from "../types";
import { useCheckShoot } from "./useCheckShoot";

export const useUserTurn = () => {
  const { misses, ships, notAllowed } = useAppSelector(selectRivalData);
  const dispatch = useAppDispatch();
  // const { computerTurn } = useComputerTurn();
  const { checkShoot } = useCheckShoot(true);

  const userTurn = (shoot: number) => {
    if (
      !misses.includes(shoot) &&
      !notAllowed.includes(shoot) &&
      !ships.some((ship) => ship.woundedCells.includes(shoot))
    ) {
      checkShoot(shoot);
      const cloneShips = JSON.parse(JSON.stringify(ships)) as IShip[];

      const index = ships.findIndex((ship) =>
        ship.shipLocation.includes(shoot)
      );

      if (index !== -1) {
        const ship = cloneShips[index];
        ship.woundedCells.push(shoot);

        if (ship.woundedCells.length === ship.decks) {
          dispatch(addNotAllowed(ship.occupiedCells));
        }
        if (
          cloneShips.filter((ship) => ship.decks === ship.woundedCells.length)
            .length === 10
        ) {
          setWinner(PERSON.user);
          dispatch(setWinner(PERSON.user));
        }
      } else {
        // dispatch(setIsUserShot(false));
        // computerTurn();
      }
    }
  };

  return { userTurn };
};
