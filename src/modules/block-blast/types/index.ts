export enum Block {
  I = "I",
  J = "J",
  L = "L",
  O = "O",
  S = "S",
  T = "T",
  Z = "Z",
}

export type BlockShape = boolean[][];

export const BLOCK_L = {
  [Block.I]: 4,
  [Block.J]: 4,
  [Block.L]: 4,
  [Block.O]: 4,
  [Block.S]: 4,
  [Block.T]: 4,
  [Block.Z]: 4,
};
