import { BOARD_COLS, BOARD_ROWS } from "../constants";
import type { TetrominoType } from "../types";

export class CollisionDetection {
  public canMove(
    nextX: number,
    nextY: number,
    nextShape: number[],
    boardData: (TetrominoType | null)[][],
  ): boolean {
    return nextShape.every((index) => {
      const col = index % BOARD_COLS;
      const row = Math.floor(index / BOARD_COLS);
      const targetX = nextX + col;
      const targetY = nextY + row;

      const isInsideHorizontal = targetX >= 0 && targetX < BOARD_COLS;
      const isInsideVertical = targetY < BOARD_ROWS;
      const boardRow = boardData[targetY];
      const isCellEmpty =
        targetY < 0 || (boardRow && boardRow[targetX] === null);

      return isInsideHorizontal && isInsideVertical && isCellEmpty;
    });
  }
}
