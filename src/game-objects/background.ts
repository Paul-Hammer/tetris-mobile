import type { MainScene } from "../scenes/main-scene";
import type { Position } from "../types";

export class Background {
  private scene: MainScene;
  private tileSprite: Phaser.GameObjects.TileSprite;
  public position: Position;

  constructor({ scene, position }: { scene: MainScene; position: Position }) {
    this.scene = scene;
    this.position = position;

    const { width, height } = this.scene.scale;

    this.tileSprite = this.scene.add
      .tileSprite(this.position.x, this.position.y, width, height, "bg")
      .setOrigin(0);
  }

  public create() {
    this.scene.add.existing(this.tileSprite);
  }
}
