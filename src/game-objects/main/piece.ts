import { MainScene } from "../../scenes/main";
import { TetrominoType, type Position } from "../../types";
import { BOARD_COLS, FRAMES, SHAPES, BLOCK_SIZE } from "../../constants";

export class Piece {
  private scene: MainScene;
  public container: Phaser.GameObjects.Container;

  public shape: number[];
  public frame: number;
  public type: TetrominoType;
  public boardPosition: Position;
  public currentRotation: number = 0;

  constructor({
    scene,
    type,
    position,
  }: {
    scene: MainScene;
    type: TetrominoType;
    position: { x: number; y: number };
  }) {
    this.scene = scene;
    this.type = type;
    this.shape = SHAPES[type][this.currentRotation];
    this.frame = FRAMES[this.scene.gameState.tetrominoVariants.current][type];
    this.boardPosition = position;

    this.container = this.scene.add
      .container(
        this.boardPosition.x * BLOCK_SIZE,
        this.boardPosition.y * BLOCK_SIZE,
      )
      .setMask(this.scene.ui.components.board.boundsMask);
  }

  public create() {
    this.container.removeAll(true);

    const blocks: Phaser.GameObjects.Sprite[] = [];
    const boardX = this.scene.ui.components.board.position.x;
    const boardY = this.scene.ui.components.board.position.y;

    this.shape.forEach((index) => {
      const col = index % BOARD_COLS;
      const row = Math.floor(index / BOARD_COLS);
      const x = col * BLOCK_SIZE + boardX;
      const y = row * BLOCK_SIZE + boardY;

      const block = this.scene.add
        .sprite(x, y, "blocks", this.frame)
        .setOrigin(0);

      blocks.push(block);
    });

    this.container.add(blocks);
  }

  public moveSide(dx: number) {
    this.boardPosition.x += dx;
    this.container.x = this.boardPosition.x * BLOCK_SIZE;
  }

  public moveDown() {
    this.container.y += BLOCK_SIZE;
    this.boardPosition.y += 1;
  }

  public rotate() {
    const nextRotation = (this.currentRotation + 1) % 4;
    const nextShape = SHAPES[this.type][nextRotation];

    this.currentRotation = nextRotation;
    this.shape = nextShape;
    this.create();
  }

  public get x() {
    return this.boardPosition.x;
  }

  public get y() {
    return this.boardPosition.y;
  }

  public blink() {
    this.scene.tweens.add({
      targets: [this.container],
      alpha: 0.3,
      duration: 100,
      repeat: 29,
      yoyo: true,
    });
  }

  public destroy() {
    this.container.removeAll(true);
    this.container.destroy();
  }
}
