import { IShip } from "../../types";

export const isCanDrop = (settedShips: IShip[], currentShip: number[]) => {
  return !settedShips.some((ship) => {
    return (
      currentShip.some((coordinate) => {
        return ship.occupiedCells.some((cell) => cell === coordinate);
      }) ||
      currentShip.some((coordinate) => {
        return ship.shipLocation.some((cell) => cell === coordinate);
      })
    );
  });
};
