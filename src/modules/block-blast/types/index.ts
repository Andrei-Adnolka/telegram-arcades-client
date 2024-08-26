export enum Block {
  I = "I",
  J = "J",
  L = "L",
  O = "O",
  S = "S",
  T = "T",
  Z = "Z",
  A = "A",
  B = "B",
  C = "C",
  D = "D",
}
export enum EmptyCell {
  Empty = "Empty",
}

export type BlockShape = boolean[][];
export type BlastCell = Block | EmptyCell;
export type BoardShape = BlastCell[][];

export const BLOCK_L = {
  [Block.I]: 4,
  [Block.J]: 4,
  [Block.L]: 4,
  [Block.O]: 4,
  [Block.S]: 4,
  [Block.T]: 4,
  [Block.Z]: 4,
  [Block.A]: 3,
  [Block.B]: 6,
  [Block.C]: 3,
  [Block.D]: 2,
};
