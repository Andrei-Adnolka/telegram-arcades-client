export const COOKIES_HIGHT_SCORE_NAME = "block-blast-hight-score";
export const STORAGE_NAME = "block-blast-return-data";

export const BOARD_WIDTH = 8;
export const BOARD_HEIGHT = 8;

export const SHAPES = {
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
  A: {
    shape: [
      [false, true, false],
      [false, true, false],
      [false, true, false],
    ],
  },
  B: {
    shape: [
      [false, true, true],
      [false, true, true],
      [false, true, true],
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
    shape: [
      [false, false, false],
      [false, true, true],
      [false, false, false],
    ],
  },
};
