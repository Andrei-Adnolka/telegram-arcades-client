export enum ButtonIds {
  Left = "button_left",
  Right = "button_right",
  Bottom = "button_bottom",
  Top = "button_top",
  Rotate = "button_rotate",
}
export const LEVELS = [
  { speed: 800, score: { start: 0, end: 20 } },
  { speed: 700, score: { start: 20, end: 50 } },
  { speed: 600, score: { start: 50, end: 500 } },
  { speed: 500, score: { start: 7500, end: 10000 } },
  { speed: 400, score: { start: 10000, end: 12500 } },
  { speed: 300, score: { start: 12500, end: 15000 } },
  { speed: 200, score: { start: 15000, end: 20000 } },
  { speed: 150, score: { start: 20000, end: 25000 } },
  { speed: 110, score: { start: 25000, end: 1000000000 } },
];
