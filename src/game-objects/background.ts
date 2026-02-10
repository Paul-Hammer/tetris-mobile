import type { MainScene } from "../scenes/main-scene";
import type { Position } from "../types";

export class Background {
  private scene: MainScene;
  private image: Phaser.GameObjects.Image;
  public position: Position;

  constructor({ scene, position }: { scene: MainScene; position: Position }) {
    this.scene = scene;
    this.position = position;

    this.image = new Phaser.GameObjects.Image(
      this.scene,
      this.position.x,
      this.position.y,
      "bg",
    ).setOrigin(0);
  }

  create() {
    // this.image.addToDisplayList();
    this.scene.add.existing(this.image);
  }
}
