import Phaser from "phaser";

import { StartButton } from "../game-objects/title/start-button";
import { LayeredTitle } from "../game-objects/title/layered-title";
import { SceneKey } from "../constants";

export class TitleScene extends Phaser.Scene {
  static gapBetweenTitleAndButton = 40;

  constructor() {
    super({ key: SceneKey.Title, active: false });
  }

  create() {
    const layeredTitle = new LayeredTitle({ scene: this });
    layeredTitle.create();

    const startButton = new StartButton({ scene: this });
    startButton.create();
  }
}
