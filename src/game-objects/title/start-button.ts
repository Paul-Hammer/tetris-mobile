import Phaser from "phaser";

import { TitleScene } from "../../scenes/title";
import { SceneKey } from "../../constants";

export class StartButton {
  private scene: TitleScene;
  private buttonText: Phaser.GameObjects.Text;
  private button: Phaser.GameObjects.Image;
  private container: Phaser.GameObjects.Container;
  private textValue = "START GAME";

  static height = 44;

  constructor({ scene }: { scene: TitleScene }) {
    this.scene = scene;

    const gameWidth = this.scene.scale.width;
    const gameHeight = this.scene.scale.height;
    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: 18,
      fontStyle: "bold",
      color: "#ffffff",
    };

    const x = gameWidth / 2;
    const y =
      (gameHeight + StartButton.height + TitleScene.gapBetweenTitleAndButton) /
      2;

    this.container = new Phaser.GameObjects.Container(this.scene, x, y);
    this.button = this.scene.add.image(0, 0, "start-button").setOrigin(0.5);
    this.buttonText = this.scene.add
      .text(0, 0, this.textValue, textStyle)
      .setOrigin(0.5);

    this.container.add([this.button, this.buttonText]);

    this.button.setInteractive({ useHandCursor: true });
    this.button.once("pointerdown", () => {
      this.scene.scene.start(SceneKey.Main);
    });
  }

  public create() {
    this.scene.add.existing(this.container);
  }
}
