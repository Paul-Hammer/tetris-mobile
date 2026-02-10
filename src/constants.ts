import type { TetrominoType } from "./types";

export enum SceneKey {
  Main = "Main",
  Preload = "Preload",
}

export const BLOCK_SIZE = 24;
export const BOARD_COLS = 10;
export const BOARD_ROWS = 20;

// FFA500

export const COLORS = {
  BOARD_BG: 0x000000,
  GRID_LINE: 0x333333,
  UI_BG: 0x1a1a1a,
  BOARD_WRAPPER: 0xffa500,
};

// https://tetris.wiki/Super_Rotation_System
export const SHAPES: Record<TetrominoType, number[][]> = {
  I: [
    [BOARD_COLS, BOARD_COLS + 1, BOARD_COLS + 2, BOARD_COLS + 3],
    [2, BOARD_COLS + 2, BOARD_COLS * 2 + 2, BOARD_COLS * 3 + 2],
    [
      BOARD_COLS * 2,
      BOARD_COLS * 2 + 1,
      BOARD_COLS * 2 + 2,
      BOARD_COLS * 2 + 3,
    ],
    [1, BOARD_COLS + 1, BOARD_COLS * 2 + 1, BOARD_COLS * 3 + 1],
  ],

  J: [
    [0, BOARD_COLS, BOARD_COLS + 1, BOARD_COLS + 2],
    [1, 2, BOARD_COLS + 1, BOARD_COLS * 2 + 1],
    [BOARD_COLS, BOARD_COLS + 1, BOARD_COLS + 2, BOARD_COLS * 2 + 2],
    [1, BOARD_COLS + 1, BOARD_COLS * 2, BOARD_COLS * 2 + 1],
  ],

  L: [
    [2, BOARD_COLS, BOARD_COLS + 1, BOARD_COLS + 2],
    [1, BOARD_COLS + 1, BOARD_COLS * 2 + 1, BOARD_COLS * 2 + 2],
    [BOARD_COLS, BOARD_COLS + 1, BOARD_COLS + 2, BOARD_COLS * 2],
    [0, 1, BOARD_COLS + 1, BOARD_COLS * 2 + 1],
  ],

  O: [
    [0, 1, BOARD_COLS, BOARD_COLS + 1],
    [0, 1, BOARD_COLS, BOARD_COLS + 1],
    [0, 1, BOARD_COLS, BOARD_COLS + 1],
    [0, 1, BOARD_COLS, BOARD_COLS + 1],
  ],

  S: [
    [1, 2, BOARD_COLS, BOARD_COLS + 1],
    [1, BOARD_COLS + 1, BOARD_COLS + 2, BOARD_COLS * 2 + 2],
    [BOARD_COLS + 1, BOARD_COLS + 2, BOARD_COLS * 2, BOARD_COLS * 2 + 1],
    [0, BOARD_COLS, BOARD_COLS + 1, BOARD_COLS * 2 + 1],
  ],

  T: [
    [1, BOARD_COLS, BOARD_COLS + 1, BOARD_COLS + 2],
    [1, BOARD_COLS + 1, BOARD_COLS + 2, BOARD_COLS * 2 + 1],
    [BOARD_COLS, BOARD_COLS + 1, BOARD_COLS + 2, BOARD_COLS * 2 + 1],
    [1, BOARD_COLS, BOARD_COLS + 1, BOARD_COLS * 2 + 1],
  ],

  Z: [
    [0, 1, BOARD_COLS + 1, BOARD_COLS + 2],
    [2, BOARD_COLS + 1, BOARD_COLS + 2, BOARD_COLS * 2 + 1],
    [BOARD_COLS, BOARD_COLS + 1, BOARD_COLS * 2 + 1, BOARD_COLS * 2 + 2],
    [1, BOARD_COLS, BOARD_COLS + 1, BOARD_COLS * 2],
  ],
};

export const FRAMES: Record<TetrominoType, number>[] = [
  {
    I: 0,
    J: 1,
    L: 2,
    O: 0,
    S: 1,
    T: 0,
    Z: 2,
  },
  {
    I: 3,
    J: 4,
    L: 5,
    O: 3,
    S: 4,
    T: 3,
    Z: 5,
  },
  {
    I: 6,
    J: 7,
    L: 8,
    O: 6,
    S: 7,
    T: 6,
    Z: 8,
  },
  {
    I: 9,
    J: 10,
    L: 11,
    O: 9,
    S: 10,
    T: 9,
    Z: 11,
  },
  {
    I: 12,
    J: 13,
    L: 14,
    O: 12,
    S: 13,
    T: 12,
    Z: 14,
  },
  {
    I: 15,
    J: 16,
    L: 17,
    O: 15,
    S: 16,
    T: 15,
    Z: 17,
  },
  {
    I: 18,
    J: 19,
    L: 20,
    O: 18,
    S: 19,
    T: 18,
    Z: 20,
  },
  {
    I: 21,
    J: 22,
    L: 23,
    O: 21,
    S: 22,
    T: 21,
    Z: 23,
  },
  {
    I: 24,
    J: 25,
    L: 26,
    O: 24,
    S: 25,
    T: 24,
    Z: 26,
  },
  {
    I: 27,
    J: 28,
    L: 29,
    O: 27,
    S: 28,
    T: 27,
    Z: 29,
  },
];
