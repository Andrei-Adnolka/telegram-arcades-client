export enum Block {
  I = "I",
  I1 = "I1",
  J = "J",
  J1 = "J1",
  L = "L",
  L1 = "L1",
  O = "O",
  S = "S",
  S1 = "S1",
  T = "T",
  T1 = "T1",
  T2 = "T2",
  T3 = "T3",
  Z = "Z",
  Z1 = "Z1",
  A = "A",
  A1 = "A1",
  B = "B",
  B1 = "B1",
  C = "C",
  D = "D",
  G = "G",
  G1 = "G1",
  G2 = "G2",
  G3 = "G3",
}
export enum EmptyCell {
  Empty = "Empty",
}

export type Blocks = { block: Block; shape: BlockShape }[];

export type BlockShape = boolean[][];
export type BlastCell = Block | EmptyCell;
export type BoardShape = BlastCell[][];

export const BLOCK_L = {
  [Block.I]: 4,
  [Block.I1]: 4,
  [Block.J]: 4,
  [Block.J1]: 4,
  [Block.L]: 4,
  [Block.L1]: 4,
  [Block.O]: 4,
  [Block.S]: 4,
  [Block.S1]: 4,
  [Block.T]: 4,
  [Block.T1]: 4,
  [Block.T2]: 4,
  [Block.T3]: 4,
  [Block.Z]: 4,
  [Block.Z1]: 4,
  [Block.A]: 3,
  [Block.A1]: 3,
  [Block.B]: 6,
  [Block.B1]: 6,
  [Block.C]: 3,
  [Block.D]: 2,
  [Block.G]: 4,
  [Block.G1]: 4,
  [Block.G2]: 4,
  [Block.G3]: 4,
};

export const SHAPES = {
  I: {
    shape: [[true, true, true, true]],
  },
  I1: {
    shape: [[true], [true], [true], [true]],
  },
  J: {
    shape: [
      [true, false, false],
      [true, true, true],
      // [false, false, false],
    ],
  },
  J1: {
    shape: [
      [true, true, true],
      [true, false, false],
      // [false, false, false],
    ],
  },
  L: {
    shape: [
      [false, false, true],
      [true, true, true],
    ],
  },
  L1: {
    shape: [
      [true, true, true],
      [false, false, true],
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
      [false, true, true],
      [true, true, false],
    ],
  },
  S1: {
    shape: [
      [true, false],
      [true, true],
      [false, true],
    ],
  },
  Z: {
    shape: [
      [true, true, false],
      [false, true, true],
      [false, false, false],
    ],
  },
  Z1: {
    shape: [
      [false, true],
      [true, true],
      [true, false],
    ],
  },
  T: {
    shape: [
      [false, true, false],
      [true, true, true],
    ],
  },
  T1: {
    shape: [
      [true, false],
      [true, true],
      [true, false],
    ],
  },
  T2: {
    shape: [
      [true, true, true],
      [false, true, false],
    ],
  },
  T3: {
    shape: [
      [false, true],
      [true, true],
      [false, true],
    ],
  },
  A: {
    shape: [[true], [true], [true]],
  },
  A1: {
    shape: [[true, true, true]],
  },
  B: {
    shape: [
      [true, true, true],
      [true, true, true],
    ],
  },
  B1: {
    shape: [
      [true, true],
      [true, true],
      [true, true],
    ],
  },
  C: {
    shape: [
      [false, false, true],
      [false, true, false],
      [true, false, false],
    ],
  },
  D: {
    shape: [[true, true]],
  },
  G: {
    shape: [
      [true, true, true],
      [true, false, true],
    ],
  },
  G1: {
    shape: [
      [true, true],
      [false, true],
      [true, true],
    ],
  },
  G2: {
    shape: [
      [true, true],
      [true, false],
      [true, true],
    ],
  },
  G3: {
    shape: [
      [true, false, true],
      [true, true, true],
    ],
  },
};
