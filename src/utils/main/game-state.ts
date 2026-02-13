import { BoardData } from "./board-data";
import { TetrominoVariants } from "./tetromino-variants";
import type { TetrominoType } from "../../types";

const DEFAULT_DROP_INTERVAL = 1000;
const BASE_POINTS = [0, 40, 100, 300, 1200];

export class GameState {
  public isGameOver: boolean = false;
  public boardData: BoardData;
  public tetrominoVariants: TetrominoVariants;
  public dropInterval: number = DEFAULT_DROP_INTERVAL;
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
    this.tetrominoVariants = new TetrominoVariants();
  }

  public incrementLevel() {
    this.level++;
  }

  public increaseGameSpeed() {
    this.dropInterval = Math.max(100, this.dropInterval - this.level * 10);
  }

  public shouldLevelUp() {
    // Increase level after each 10th cleared line
    return this.linesCleared >= (this.level + 1) * 10;
  }

  public levelUp() {
    this.incrementLevel();
    this.tetrominoVariants.next();
    this.increaseGameSpeed();
  }

  public updateScore({ clearedLines }: { clearedLines: number }) {
    const pointsEarned = BASE_POINTS[clearedLines] * (this.level + 1);

    this.score += pointsEarned;
    this.linesCleared += clearedLines;
  }

  public reset() {
    this.isGameOver = false;
    this.boardData.reset();
    this.tetrominoVariants.reset();
    this.level = 0;
    this.score = 0;
    this.linesCleared = 0;
    this.dropInterval = DEFAULT_DROP_INTERVAL;
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
