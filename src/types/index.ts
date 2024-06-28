export enum Block {
  I = "I",
  J = "J",
  L = "L",
  O = "O",
  S = "S",
  T = "T",
  Z = "Z",
}

export enum FoodCell {
  Food = "Food",
}

export enum SnakeCell {
  Snake = "Snake",
}

export enum SpaceshipCell {
  Spaceship = "Spaceship",
  Ball = "Ball",
}

export enum EmptyCell {
  Empty = "Empty",
}

export type BlockShape = boolean[][];

export type CellOptions =
  | Block
  | EmptyCell
  | SnakeCell
  | FoodCell
  | SpaceshipCell;
export type BoardShape = CellOptions[][];
export type SnakeShape = number[][];
export type SpaceshipShape = number[][];

type ShapesObj = {
  [key in Block]: {
    shape: BlockShape;
  };
};

export const SHAPES: ShapesObj = {
  I: {
    shape: [
      [false, false, false, false],
      [false, false, false, false],
      [true, true, true, true],
      [false, false, false, false],
    ],
  },
  J: {
    shape: [
      [false, false, false],
      [true, false, false],
      [true, true, true],
    ],
  },
  L: {
    shape: [
      [false, false, false],
      [false, false, true],
      [true, true, true],
    ],
  },
  O: {
    shape: [
      [true, true],
      [true, true],
    ],
  },
  S: {
    shape: [
      [false, false, false],
      [false, true, true],
      [true, true, false],
    ],
  },
  T: {
    shape: [
      [false, false, false],
      [false, true, false],
      [true, true, true],
    ],
  },
  Z: {
    shape: [
      [false, false, false],
      [true, true, false],
      [false, true, true],
    ],
  },
};
