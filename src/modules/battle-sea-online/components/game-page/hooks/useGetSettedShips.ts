import { useMemo } from "react";

import { selectShips } from "../../../redux/userSlice";
import { useAppSelector } from "../../../redux/hooks";

export const useGetSettedShips = () => {
  const ships = useAppSelector(selectShips);

  const restShips = useMemo(() => {
    const shipsList = ships.map((ship) => ship.decks);
    const shipsSetter = shipsList.reduce(
      (acc, curr) => {
        acc[curr as keyof typeof acc].pop();
        return acc;
      },
      { 4: [4], 3: [3, 3], 2: [2, 2, 2], 1: [1, 1, 1, 1] }
    );
    return Object.values(shipsSetter)
      .flat()
      .sort((a, b) => b - a);
  }, [ships]);

  return { restShips };
};
