import Phaser from "phaser";

import { UI } from "../game-objects/preload/ui";
import { BLOCK_SIZE, SceneKey } from "../constants";

const LIFE_TIME = 5000;

export class PreloadScene extends Phaser.Scene {
  private ui!: UI;

  constructor() {
    super({ key: SceneKey.Preload, active: true });
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

    this.load.spritesheet("game-title", "assets/images/title-layers.png", {
      frameWidth: 320,
      frameHeight: 120,
      startFrame: 0,
      endFrame: 2,
      margin: 0,
      spacing: 2,
    });

    this.load.image("bg", "assets/images/background.png");
    this.load.image("stats", "assets/images/header-stats-block.svg");
    this.load.image("nextPiece", "assets/images/next-piece-block.svg");
    this.load.image("start-button", "assets/images/start-button.png");
  }

  create() {
    this.ui = new UI({ scene: this });
    this.ui.create();

    this.time.delayedCall(LIFE_TIME, () => {
      this.scene.start(SceneKey.Title);
    });
  }
}
