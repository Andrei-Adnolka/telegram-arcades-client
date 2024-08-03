export interface IShip {
  shipLocation: number[];
  decks: number;
  occupiedCells: number[];
  woundedCells: number[];
  isHorizontal: boolean;
}

export interface IPlayerState {
  ships: IShip[];
  misses: number[];
  notAllowed: number[];
}

export interface IGameShips {
  user: IPlayerState;
  rival: IPlayerState;
}

export type Person = {
  person: "user" | "rival";
};

export interface ISetShip {
  decks: number | null;
  isHorizontal: boolean;
}

export enum PERSON {
  user = "user",
  rival = "rival",
  // computer = "Computer",
  // you = "You",
}
