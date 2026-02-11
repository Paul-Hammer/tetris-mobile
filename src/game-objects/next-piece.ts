import Phaser from "phaser";

import { MainScene } from "../scenes/main-scene";
import type { Position, TetrominoType } from "../types";
import { BLOCK_SIZE, BOARD_COLS, FRAMES, SHAPES } from "../constants";

const PIECE_WIDTH: Record<TetrominoType, number> = {
  I: 4,
  J: 3,
  L: 3,
  O: 2,
  S: 3,
  T: 3,
  Z: 3,
};

const PIECE_HEIGHT: Record<TetrominoType, number> = {
  I: 3,
  J: 2,
  L: 2,
  O: 2,
  S: 2,
  T: 2,
  Z: 2,
};

export class NextPiece {
  private scene: MainScene;
  private container: Phaser.GameObjects.Container;

  public width = 40;
  public height = 138;
  public position: Position = { x: 0, y: 0 };
  public list = [];
  private borderWidth = 2;
  private textBlockHeight = 18;
  private fontSize = 12;
  private text = "NEXT";
  private scale = 0.25;
  private pieceBlockWidth = 40;
  private pieceBlockHeight = 40;
  private blockSize = BLOCK_SIZE * this.scale;

  static marginLeft = 10;
  static marginTop = 20;

  constructor({ scene, position }: { scene: MainScene; position: Position }) {
    this.scene = scene;
    this.position = position;

    this.container = new Phaser.GameObjects.Container(
      this.scene,
      this.position.x,
      this.position.y,
    );
  }

  public create() {
    this.container.removeAll(true);

    const wrapper = this.scene.add.image(0, 0, "nextPiece").setOrigin(0);
    const text = this.scene.add
      .text(
        0,
        (this.textBlockHeight - this.fontSize) / 2 + this.borderWidth,
        this.text,
        {
          color: "#ffffff",
          fontSize: this.fontSize,
          fixedHeight: this.textBlockHeight,
          fixedWidth: this.width,
          align: "center",
        },
      )
      .setOrigin(0);

    const blocksContainer = this.scene.add.container(0, 20);

    this.scene.typesQueue.queue.forEach((type, j) => {
      const shape = SHAPES[type][0];
      const frame =
        FRAMES[this.scene.gameState.tetrominoVariants.current][type];

      shape.forEach((index) => {
        const col = index % BOARD_COLS;
        const row = Math.floor(index / BOARD_COLS);

        const x =
          col * this.blockSize +
          (this.width - PIECE_WIDTH[type] * this.blockSize) / 2;

        const y =
          row * this.blockSize +
          j * this.pieceBlockHeight +
          (this.pieceBlockHeight - PIECE_HEIGHT[type] * this.blockSize) / 2;

        const block = this.scene.add
          .sprite(x, y, "blocks", frame)
          .setOrigin(0)
          .setScale(this.scale);

        blocksContainer.add(block);
      });
    });

    this.container.add([wrapper, text, blocksContainer]);
    this.scene.add.existing(this.container);
  }

  public update() {
    this.create();
  }
}
