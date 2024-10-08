import { IShip, IPlayerState } from "../types";

export const getSendData = (
  event: string,
  payload: Record<string, string | number | IPlayerState>
) => {
  return JSON.stringify({ event, payload });
};

export const findShip = (id: number, settedShips?: IShip[]) => {
  if (settedShips) {
    return settedShips.find((ship) => ship.shipLocation.includes(id));
  }
  return null;
};
