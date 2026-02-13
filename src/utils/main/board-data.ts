import { Piece } from "../../game-objects/main/piece";
import type { TetrominoType } from "../../types";
import { BOARD_COLS, BOARD_ROWS } from "../../constants";

export class BoardData {
  public data: (TetrominoType | null)[][];

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

  public canSpawnPiece(piece: Piece) {
    return piece.shape.every((index) => {
      const col = index % BOARD_COLS;
      const row = Math.floor(index / BOARD_COLS);
      const boardX = piece.x + col;
      const boardY = piece.y + row;

      const cell = this.data[boardY][boardX];

      return cell === null;
    });
  }

  public reset() {
    this.data = this.createData();
  }
}
