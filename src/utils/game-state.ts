import { BoardData } from "./board-data";
import type { TetrominoType } from "../types";

const DEFAULT_DROP_INTERVAL = 1000;

export class GameState {
  public isGameOver: boolean = false;
  public boardData: BoardData;
  public dropInterval: number = DEFAULT_DROP_INTERVAL;
  public currentFrameIndex = 0; // UI colors
  public level: number = 0;
  public score: number = 0;
  public linesCleared: number = 0;
  public spawnedPieces: Record<TetrominoType, number> = {
    I: 0,
    J: 0,
    L: 0,
    O: 0,
    S: 0,
    T: 0,
    Z: 0,
  };

  constructor() {
    this.boardData = new BoardData();
  }

  public incrementLevel() {
    this.level++;
  }

  public incrementCurrentFrameIndex() {
    this.currentFrameIndex =
      this.currentFrameIndex === 9 ? 0 : this.currentFrameIndex + 1;
  }

  public increaseGameSpeed() {
    this.dropInterval = Math.max(100, this.dropInterval - this.level * 10);
  }

  public reset() {
    this.isGameOver = false;
    this.boardData.reset();
    this.currentFrameIndex = 0;
    this.level = 0;
    this.score = 0;
    this.linesCleared = 0;
    this.spawnedPieces = {
      I: 0,
      J: 0,
      L: 0,
      O: 0,
      S: 0,
      T: 0,
      Z: 0,
    };
  }
}
