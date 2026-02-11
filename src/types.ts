export type Position = {
  x: number;
  y: number;
};

export enum TetrominoType {
  I = "I",
  J = "J",
  L = "L",
  O = "O",
  S = "S",
  T = "T",
  Z = "Z",
}

export enum ControlsFrame {
  Left = 0,
  Up = 1,
  Rotate = 2,
  Down = 3,
  Right = 4,
}
