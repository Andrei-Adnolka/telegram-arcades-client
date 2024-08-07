import { useAppSelector } from "../../../redux/hooks";
import {
  usePersonData,
  usePersonActionsData,
} from "../../../redux/usePersonData";
import { selectSound } from "../../../redux/gameSlice";
import Sound from "../API/Sound/Sound";

export const useCheckShoot = (isRival: boolean) => {
  const person = usePersonData(isRival);
  const { sendMisses, sendNewShips } = usePersonActionsData(isRival);
  const sound = useAppSelector(selectSound);

  const checkShoot = (cell: number) => {
    const ships = person.ships.map((ship) => ship.shipLocation);
    const index = ships.findIndex((coordinates) => coordinates.includes(cell));

    if (index !== -1) {
      if (sound) {
        Sound("shot");
      }
      const newShips = JSON.parse(JSON.stringify(person.ships));
      newShips[index].woundedCells.push(cell);
      sendNewShips(newShips);
    } else {
      if (sound) {
        Sound("bulk");
      }
      sendMisses(cell);
    }
  };
  return { checkShoot };
};
