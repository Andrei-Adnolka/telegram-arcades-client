import { useAppSelector } from "../../../redux/hooks";
import {
  usePersonData,
  usePersonActionsData,
} from "../../../redux/usePersonData";
import { selectSound } from "../../../redux/gameSlice";
import Sound from "../API/Sound/Sound";

export const useCheckShoot = (isRival: boolean) => {
  const person = usePersonData(isRival);
  const { sendMisses, sendNewShips, sendNotAllowed } =
    usePersonActionsData(isRival);
  const sound = useAppSelector(selectSound);

  const checkShoot = (cell: number) => {
    let isHit = false;
    let occupiedCells = [] as number[];
    const ships = person.ships.map((ship) => ship.shipLocation);
    const index = ships.findIndex((coordinates) => coordinates.includes(cell));

    if (index !== -1) {
      if (sound) {
        Sound("shot");
      }
      const newShips = JSON.parse(JSON.stringify(person.ships));
      newShips[index].woundedCells.push(cell);
      const ship = newShips[index];
      sendNewShips(newShips);
      isHit = true;
      if (ship.woundedCells.length === ship.decks) {
        sendNotAllowed(ship.occupiedCells);
      }
    } else {
      if (sound) {
        Sound("bulk");
      }
      sendMisses(cell);
    }
    return { isHit, occupiedCells };
  };
  return { checkShoot };
};
