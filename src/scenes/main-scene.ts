import Phaser from "phaser";

import { Gravity } from "../game-objects/gravity";
import { Piece } from "../game-objects/piece";
import { UI } from "../game-objects/ui";
import { GameState } from "../utils/game-state";
import { InputHandler } from "../utils/input-handler";
import { TypesQueue } from "../utils/types-queue";
import { BLOCK_SIZE, SceneKey } from "../constants";
import { CollisionEvent, ControlsEvent } from "../events";
import { TetrominoType, type Position } from "../types";

export const STARTING_POSITIONS: Record<TetrominoType, Position> = {
  S: { x: 3, y: 0 },
  Z: { x: 3, y: 0 },
  J: { x: 3, y: 0 },
  L: { x: 3, y: 0 },
  O: { x: 4, y: 0 },
  I: { x: 3, y: -1 },
  T: { x: 3, y: 0 },
};

const GAME_OVER_DELAY = 1000;

export class MainScene extends Phaser.Scene {
  public activePiece!: Piece;
  public ui!: UI;
  public typesQueue: TypesQueue;
  public gameState: GameState;
  public gravity!: Gravity;
  public inputHandler!: InputHandler;

  // Movement intervals and delays
  private softDropInterval: number = 50;
  private fastShiftDelay = 200;
  private fastShiftInterval = 50;

  // Timers
  private moveTimer: Phaser.Time.TimerEvent | null = null;

  constructor() {
    super({ key: SceneKey.Main, active: true });

    this.typesQueue = new TypesQueue();
    this.gameState = new GameState();
  }

  preload() {
    this.load.spritesheet("blocks", "assets/images/blocks.svg", {
      frameWidth: BLOCK_SIZE,
      frameHeight: BLOCK_SIZE,
      startFrame: 0,
      endFrame: 29,
      margin: 0,
      spacing: 2,
    });

    this.load.spritesheet("controls", "assets/images/controls.svg", {
      frameWidth: 60,
      frameHeight: 44,
      startFrame: 0,
      endFrame: 4,
      margin: 0,
      spacing: 2,
    });

    this.load.image("bg", "assets/images/background.png");
    this.load.image("stats", "assets/images/header-stats-block.svg");
    this.load.image("nextPiece", "assets/images/next-piece-block.svg");
  }

  create() {
    this.ui = new UI({ scene: this });
    this.ui.create();
    this.typesQueue.create();

    this.inputHandler = new InputHandler({ scene: this });
    this.gravity = new Gravity({ scene: this, callback: this.movePieceDown });
    this.spawnPiece();

    this.handleControlsEvents();
    this.handleCollisionEvents();
  }

  private spawnPiece() {
    if (this.activePiece) this.activePiece.destroy();

    const type = this.typesQueue.getNext();

    this.activePiece = new Piece({
      scene: this,
      type,
      position: { ...STARTING_POSITIONS[type] },
    });

    this.activePiece.create();
    this.gravity.start();

    this.ui.components.nextPiece.update();

    const canSpawnPiece = this.gameState.boardData.canSpawnPiece(
      this.activePiece,
    );

    if (!canSpawnPiece) this.gameOver();
  }

  private movePieceDown() {
    this.inputHandler.moveDown(this.activePiece, this.gameState.boardData.data);
  }

  private movePieceLeft() {
    this.inputHandler.moveLeft(this.activePiece, this.gameState.boardData.data);
  }

  private movePieceRight() {
    this.inputHandler.moveRight(
      this.activePiece,
      this.gameState.boardData.data,
    );
  }

  private hardDropPiece() {
    this.inputHandler.hardDrop(this.activePiece, this.gameState.boardData.data);
  }

  private rotatePiece() {
    this.inputHandler.rotate(this.activePiece, this.gameState.boardData.data);
  }

  private stopPiece() {
    this.gameState.boardData.lockPiece(this.activePiece);
    const clearedLines = this.gameState.boardData.clearLines();

    if (clearedLines > 0) this.updateScore({ clearedLines });

    this.ui.update();
    this.spawnPiece();
  }

  private destroyMoveTimer() {
    if (this.moveTimer) {
      this.moveTimer.destroy();
      this.moveTimer = null;
    }
  }

  private handleControlsEvents() {
    this.events.on(ControlsEvent.MoveLeft, () => {
      if (this.gameState.isGameOver) return;

      // Immediate shift ONE cell left on the button tap
      this.movePieceLeft();
      this.destroyMoveTimer();

      // Further fast shift left after delay while holding the button
      this.moveTimer = this.time.addEvent({
        delay: this.fastShiftDelay,
        callback: () => {
          this.moveTimer = this.time.addEvent({
            delay: this.fastShiftInterval,
            callbackScope: this,
            callback: this.movePieceLeft,
            loop: true,
          });
        },
      });
    });

    this.events.on(ControlsEvent.StopMoveLeft, () => {
      if (this.gameState.isGameOver) return;

      this.destroyMoveTimer();
    });

    this.events.on(ControlsEvent.MoveRight, () => {
      if (this.gameState.isGameOver) return;

      // Immediate shift ONE cell right on the button tap
      this.movePieceRight();
      this.destroyMoveTimer();
      // Further fast shift right after delay while holding the button
      this.moveTimer = this.time.addEvent({
        delay: this.fastShiftDelay,
        callback: () => {
          this.moveTimer = this.time.addEvent({
            delay: this.fastShiftInterval,
            callbackScope: this,
            callback: this.movePieceRight,
            loop: true,
          });
        },
      });
    });

    this.events.on(ControlsEvent.StopMoveRight, () => {
      if (this.gameState.isGameOver) return;

      this.destroyMoveTimer();
    });

    this.events.on(ControlsEvent.HardDrop, () => {
      if (this.gameState.isGameOver) return;

      this.hardDropPiece();
    });

    this.events.on(ControlsEvent.Rotate, () => {
      if (this.gameState.isGameOver) return;

      this.rotatePiece();
    });

    this.events.on(ControlsEvent.SoftDrop, () => {
      if (this.gameState.isGameOver) return;

      // Immediate shift ONE cell down on the button tap
      this.movePieceDown();

      // Further fast shift down after delay while holding the button
      this.gravity.reset({
        delay: this.softDropInterval,
        paused: false,
      });
    });

    this.events.on(ControlsEvent.StopSoftDrop, () => {
      if (this.gameState.isGameOver) return;

      // Reset speed to level speed
      this.gravity.reset({
        delay: this.gameState.dropInterval,
        paused: false,
      });
    });
  }

  private handleCollisionEvents() {
    this.events.on(CollisionEvent, () => {
      this.stopPiece();
    });
  }

  private updateScore({ clearedLines }: { clearedLines: number }) {
    this.gameState.updateScore({ clearedLines });

    if (this.gameState.shouldLevelUp()) this.gameState.levelUp();
  }

  private gameOver() {
    this.gameState.isGameOver = true;
    this.gravity.pause();
    this.activePiece.blink();

    const timerEvent = this.time.addEvent({
      delay: GAME_OVER_DELAY,
      callback: () => {
        this.gameState.reset();
        this.gravity.reset({
          delay: this.gameState.dropInterval,
          paused: true,
        });
        this.ui.update();
        this.spawnPiece();

        timerEvent.remove();
      },
    });
  }
}
