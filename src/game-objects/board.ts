import Phaser from "phaser";

import { MainScene } from "../scenes/main-scene";
import type { Position } from "../types";
import {
  BLOCK_SIZE,
  BOARD_COLS,
  BOARD_ROWS,
  COLORS,
  FRAMES,
} from "../constants";

export class Board {
  private scene: MainScene;
  private staticSprites: Phaser.GameObjects.Group;
  private graphics: Phaser.GameObjects.Graphics;
  public boundsMask: Phaser.Display.Masks.GeometryMask;

  static width = BOARD_COLS * BLOCK_SIZE; // 240px
  static height = BOARD_ROWS * BLOCK_SIZE; // 480px
  public position: Position;
  public isDrawn: boolean = false;

  constructor({ scene, position }: { scene: MainScene; position: Position }) {
    this.scene = scene;
    this.graphics = new Phaser.GameObjects.Graphics(this.scene);
    this.staticSprites = this.scene.add.group();
    this.position = position;
    this.boundsMask = this.createBounds({ position: this.position });
  }

  public create() {
    this.createBoard();
    this.createStaticSprites();
    this.isDrawn = true;

    return this.isDrawn;
  }

  private createBoard() {
    this.graphics.clear();
    // 1. Background
    this.graphics.fillStyle(COLORS.BOARD_BG, 1);
    this.graphics.fillRect(
      this.position.x,
      this.position.y,
      Board.width,
      Board.height,
    );

    // 2. Grid
    this.graphics.lineStyle(1, COLORS.GRID_LINE, 1);

    // Grid vertical lines
    for (let i = 0; i <= BOARD_COLS; i++) {
      const x = this.position.x + i * BLOCK_SIZE;

      this.graphics.lineBetween(
        x,
        this.position.y,
        x,
        this.position.y + Board.height,
      );
    }

    // Grid horizontal lines
    for (let j = 0; j <= BOARD_ROWS; j++) {
      const y = this.position.y + j * BLOCK_SIZE;

      this.graphics.lineBetween(
        this.position.x,
        y,
        this.position.x + Board.width,
        y,
      );
    }

    this.scene.add.existing(this.graphics);
  }

  private createStaticSprites() {
    this.staticSprites.clear(true, true);

    this.scene.gameState.boardData.data.forEach((row, y) => {
      row.forEach((type, x) => {
        if (type === null) return;

        const block = this.scene.add
          .sprite(
            x * BLOCK_SIZE + this.position.x,
            y * BLOCK_SIZE + this.position.y,
            "blocks",
            FRAMES[this.scene.gameState.currentFrameIndex][type],
          )
          .setOrigin(0)
          .setName(type);

        this.staticSprites.add(block);
      });
    });
  }

  // NOTE: This mask prevents active piece to drop out of board bounds (only its visual part)
  private createBounds({ position }: { position: Position }) {
    const maskShape = this.scene.make.graphics();
    maskShape.fillRect(position.x, position.y, Board.width, Board.height);

    return maskShape.createGeometryMask();
  }

  public update() {
    this.createStaticSprites();
  }
}
