import type { Piece } from "../game-objects/piece";
import { BOARD_COLS, BOARD_ROWS } from "../constants";
import type { TetrominoType } from "../types";

export class BoardData {
  data: (TetrominoType | null)[][];

  constructor() {
    this.data = this.createData();
  }

  private createData(): (TetrominoType | null)[][] {
    return Array.from({ length: BOARD_ROWS }, () =>
      Array(BOARD_COLS).fill(null),
    );
  }

  public clearLines(): number {
    // Leave rows if they have empty space
    const newBoard = this.data.filter((row) =>
      row.some((value) => value === null),
    );

    const clearedLines = BOARD_ROWS - newBoard.length;

    if (clearedLines > 0) {
      const emptyRows: null[][] = Array.from({ length: clearedLines }, () =>
        Array(BOARD_COLS).fill(null),
      );

      // Update board data
      this.data = [...emptyRows, ...newBoard];

      return clearedLines;
    }

    return 0;
  }

  public lockPiece(piece: Piece) {
    for (const index of piece.shape) {
      const col = index % BOARD_COLS;
      const row = Math.floor(index / BOARD_COLS);
      const boardX = piece.x + col;
      const boardY = piece.y + row;

      if (boardY >= 0 && boardY < BOARD_ROWS) {
        this.data[boardY][boardX] = piece.type;
      }
    }
  }

  public reset() {
    this.data = this.createData();
  }
}
