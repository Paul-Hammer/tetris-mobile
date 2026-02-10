import Phaser from "phaser";

import { Piece } from "../game-objects/piece";
import { UI } from "../game-objects/ui";
import { CollisionDetection } from "../utils/collision-detection";
import { GameState } from "../utils/game-state";
import { TypesQueue } from "../utils/types-queue";
import { BLOCK_SIZE, SceneKey, SHAPES } from "../constants";
import { ControlsEvent, TetrominoType, type Position } from "../types";

const STARTING_POSITIONS: Record<TetrominoType, Position> = {
  S: { x: 3, y: 0 },
  Z: { x: 3, y: 0 },
  J: { x: 3, y: 0 },
  L: { x: 3, y: 0 },
  O: { x: 4, y: 0 },
  I: { x: 3, y: -1 },
  T: { x: 3, y: 0 },
};

const BASE_POINTS = [0, 40, 100, 300, 1200];
const GAME_OVER_DELAY = 1000;

export class MainScene extends Phaser.Scene {
  private activePiece!: Piece;

  // NEW
  public ui!: UI;
  public typesQueue: TypesQueue;
  public gameState: GameState;
  public collisionDetection: CollisionDetection;

  // Movement intervals and delays
  private softDropInterval: number = 50;
  private fastShiftDelay = 200;
  private fastShiftInterval = 50;

  // Timers
  moveTimer: Phaser.Time.TimerEvent | null = null;
  gravityTimer!: Phaser.Time.TimerEvent;

  constructor() {
    super({ key: SceneKey.Main, active: true });

    this.collisionDetection = new CollisionDetection();
    this.typesQueue = new TypesQueue();
    this.gameState = new GameState();
  }

  preload() {
    this.load.spritesheet("blocks", "/assets/images/blocks.svg", {
      frameWidth: BLOCK_SIZE,
      frameHeight: BLOCK_SIZE,
      startFrame: 0,
      endFrame: 29,
      margin: 0,
      spacing: 2,
    });

    this.load.spritesheet("controls", "/assets/images/controls.svg", {
      frameWidth: 60,
      frameHeight: 44,
      startFrame: 0,
      endFrame: 4,
      margin: 0,
      spacing: 2,
    });

    this.load.image("bg", "/assets/images/background.png");
    this.load.image("stats", "/assets/images/header-stats-block.svg");
    this.load.image("nextPiece", "/assets/images/next-piece-block.svg");
  }

  create() {
    this.ui = new UI({ scene: this });
    this.ui.create();
    this.typesQueue.create();

    this.handleControlsEvents();

    this.spawnPiece();
    this.handleGravity();
  }

  private spawnPiece() {
    const type = this.typesQueue.getNext();

    this.activePiece = new Piece({
      scene: this,
      type,
      position: { ...STARTING_POSITIONS[type] },
    });

    this.activePiece.create();
    this.ui.components.nextPiece.update();

    const canMoveNextPiece = this.collisionDetection.canMove(
      this.activePiece.x,
      this.activePiece.y,
      this.activePiece.shape,
      this.gameState.boardData.data,
    );

    if (!canMoveNextPiece) this.gameOver();
  }

  private handleMoveLeft() {
    const dx = -1;

    if (
      this.collisionDetection.canMove(
        this.activePiece.x + dx,
        this.activePiece.y,
        this.activePiece.shape,
        this.gameState.boardData.data,
      )
    ) {
      this.activePiece.moveSide(dx);
    }
  }

  private handleMoveRight() {
    console.log("Move...");
    const dx = 1;

    if (
      this.collisionDetection.canMove(
        this.activePiece.x + dx,
        this.activePiece.y,
        this.activePiece.shape,
        this.gameState.boardData.data,
      )
    ) {
      this.activePiece.moveSide(dx);
    }
  }

  private handleRotation() {
    const nextRotation = (this.activePiece.currentRotation + 1) % 4;
    const nextShape = SHAPES[this.activePiece.type][nextRotation];

    // Order of this array does matter
    const offsets = [0, -1, 1, -2, 2];

    for (const dx of offsets) {
      const canMove = this.collisionDetection.canMove(
        this.activePiece.x + dx,
        this.activePiece.y,
        nextShape,
        this.gameState.boardData.data,
      );

      if (canMove) {
        if (dx !== 0) this.activePiece.moveSide(dx);

        this.activePiece.rotate();
        return;
      }
    }

    console.log("Can not rotate even with Wall Kick...");
  }

  private handleHardDrop() {
    let linesToDrop = 0;

    while (
      this.collisionDetection.canMove(
        this.activePiece.x,
        this.activePiece.y + 1,
        this.activePiece.shape,
        this.gameState.boardData.data,
      )
    ) {
      this.activePiece.moveDown();
      linesToDrop++;
    }

    this.gameState.boardData.lockPiece(this.activePiece);
    this.destroyPiece();
    const clearedLines = this.gameState.boardData.clearLines();
    this.ui.components.board.update();
    this.updateScore({ clearedLines });

    this.spawnPiece();
  }

  private handleMoveDown() {
    const canMoveDown = this.collisionDetection.canMove(
      this.activePiece.x,
      this.activePiece.y + 1,
      this.activePiece.shape,
      this.gameState.boardData.data,
    );

    if (canMoveDown) {
      this.activePiece.moveDown();
    } else {
      this.gameState.boardData.lockPiece(this.activePiece);
      this.destroyPiece();
      const clearedLines = this.gameState.boardData.clearLines();
      this.ui.components.board.update();
      this.updateScore({ clearedLines });

      this.ui.components.board.update();

      this.spawnPiece();
    }
  }

  private destroyMoveTimer() {
    if (this.moveTimer) {
      this.moveTimer.destroy();
      this.moveTimer = null;
    }
  }

  private destroyPiece() {
    if (this.activePiece) {
      this.activePiece.destroySprites();
    }
  }

  private handleControlsEvents() {
    this.events.on(ControlsEvent.MoveLeft, () => {
      if (this.gameState.isGameOver) return;

      // Immediate shift ONE cell left on the button tap
      this.handleMoveLeft();
      this.destroyMoveTimer();
      // Further fast shift left after delay while holding the button
      this.moveTimer = this.time.addEvent({
        delay: this.fastShiftDelay,
        callback: () => {
          this.moveTimer = this.time.addEvent({
            delay: this.fastShiftInterval,
            callback: this.handleMoveLeft,
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
      this.handleMoveRight();
      this.destroyMoveTimer();
      // Further fast shift right after delay while holding the button
      this.moveTimer = this.time.addEvent({
        delay: this.fastShiftDelay,
        callback: () => {
          this.moveTimer = this.time.addEvent({
            delay: this.fastShiftInterval,
            callback: this.handleMoveRight,
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

      this.handleHardDrop();
    });

    this.events.on(ControlsEvent.Rotate, () => {
      if (this.gameState.isGameOver) return;

      this.handleRotation();
    });

    this.events.on(ControlsEvent.SoftDrop, () => {
      if (this.gameState.isGameOver) return;

      // Immediate shift ONE cell down on the button tap
      this.handleMoveDown();
      // Further fast shift down after delay while holding the button
      this.gravityTimer.reset({
        delay: this.softDropInterval,
        callback: this.handleMoveDown,
        callbackScope: this,
        loop: true,
      });
    });

    this.events.on(ControlsEvent.StopSoftDrop, () => {
      if (this.gameState.isGameOver) return;

      this.gravityTimer.reset({
        delay: this.gameState.dropInterval,
        callback: this.handleMoveDown,
        callbackScope: this,
        loop: true,
      });
    });
  }

  private handleGravity() {
    // Permanent movement down with gravity
    this.gravityTimer = this.time.addEvent({
      delay: this.gameState.dropInterval,
      callback: this.handleMoveDown,
      callbackScope: this,
      loop: true,
    });
  }

  private updateScore({ clearedLines }: { clearedLines: number }) {
    if (clearedLines === 0) return;

    const pointsEarned = BASE_POINTS[clearedLines] * (this.gameState.level + 1);

    // Update GameState
    this.gameState.score += pointsEarned;
    this.gameState.linesCleared += clearedLines;

    // Update UI
    this.ui.components.stats.updateScore(`${this.gameState.score}`);
    this.ui.components.stats.updateLines(`${this.gameState.linesCleared}`);

    // Increase level after each 10th cleared line
    if (this.gameState.linesCleared >= (this.gameState.level + 1) * 10) {
      // Update GameState
      this.gameState.incrementLevel();
      this.gameState.incrementCurrentFrameIndex();
      this.gameState.increaseGameSpeed();

      // Update UI
      this.ui.components.nextPiece.update();
      this.ui.components.board.update();
      this.ui.components.stats.updateLevel(`${this.gameState.level}`);
    }
  }

  private gameOver() {
    this.gameState.isGameOver = true;
    this.gravityTimer.paused = true;

    if (this.activePiece) this.activePiece.blink();

    const timerEvent = this.time.addEvent({
      delay: GAME_OVER_DELAY,
      callback: () => {
        this.gravityTimer.paused = false;
        // Reset GameState
        this.gameState.reset();

        // Reset UI
        this.ui.components.stats.reset();
        this.ui.components.board.update();
        this.ui.components.nextPiece.update();

        this.destroyPiece();
        this.spawnPiece();

        timerEvent.remove();
      },
    });
  }
}
