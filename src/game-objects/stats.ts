import Phaser from "phaser";

import { MainScene } from "../scenes/main-scene";
import type { Position } from "../types";

const STATS_WIDTH = 340;
const STATS_HEIGHT = 44;
const BLOCK_WIDTH = 106;
const BLOCK_HEIGHT = STATS_HEIGHT / 2;
const TEXT_FONT_SIZE = 14;
const GAP_BETWEEN_BLOCKS = 11;
const DEFAULT_VALUE = "0";

const LABEL_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  fixedWidth: BLOCK_WIDTH,
  fixedHeight: BLOCK_HEIGHT,
  align: "center",
  color: "#ffffff",
  fontSize: TEXT_FONT_SIZE,
  fontStyle: "bold",
};

const VALUE_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  fixedWidth: BLOCK_WIDTH,
  fixedHeight: BLOCK_HEIGHT,
  align: "center",
  color: "#ffffff",
};

enum ValueName {
  Lines = "lines",
  Level = "level",
  Score = "score",
}

export class Stats {
  private scene: MainScene;
  private container: Phaser.GameObjects.Container;

  static width = STATS_WIDTH;
  static height = STATS_HEIGHT;
  static marginBottom = 20;
  public position: Position;

  public isDrawn: boolean = false;

  constructor({ scene, position }: { scene: MainScene; position: Position }) {
    this.scene = scene;
    this.position = position;
    this.container = new Phaser.GameObjects.Container(
      this.scene,
      this.position.x,
      this.position.y,
    );
  }

  private createItem({
    labelText,
    valueText,
    position,
  }: {
    labelText: string;
    valueText: string;
    position: Position;
  }) {
    return {
      wrapper: this.scene.add
        .image(position.x, position.y, "stats")
        .setOrigin(0),

      label: this.scene.add
        .text(
          position.x,
          (BLOCK_HEIGHT - TEXT_FONT_SIZE) / 2,
          labelText,
          LABEL_STYLE,
        )
        .setOrigin(0),

      value: this.scene.add
        .text(
          position.x,
          BLOCK_HEIGHT + (BLOCK_HEIGHT - TEXT_FONT_SIZE) / 2,
          valueText,
          VALUE_STYLE,
        )
        .setOrigin(0),
    };
  }

  public create() {
    this.isDrawn = true;
    this.container.removeAll(true);

    const lines = this.createItem({
      position: {
        x: 0,
        y: 0,
      },
      labelText: "LINES",
      valueText: DEFAULT_VALUE,
    });

    const level = this.createItem({
      position: {
        x: BLOCK_WIDTH + GAP_BETWEEN_BLOCKS,
        y: 0,
      },
      labelText: "LEVEL",
      valueText: DEFAULT_VALUE,
    });

    const score = this.createItem({
      position: {
        x: (BLOCK_WIDTH + GAP_BETWEEN_BLOCKS) * 2,
        y: 0,
      },
      labelText: "SCORE",
      valueText: DEFAULT_VALUE,
    });

    this.container.add([
      // Lines
      lines.wrapper,
      lines.label,
      lines.value.setName(ValueName.Lines),
      // Level
      level.wrapper,
      level.label,
      level.value.setName(ValueName.Level),
      // Score
      score.wrapper,
      score.label,
      score.value.setName(ValueName.Score),
    ]);

    this.scene.add.existing(this.container);
  }

  public updateLines(updatedValue: string) {
    const linesText = this.container.getByName<Phaser.GameObjects.Text>(
      ValueName.Lines,
    );

    if (linesText) linesText.setText(updatedValue);
  }

  public updateLevel(updatedValue: string) {
    const levelText = this.container.getByName<Phaser.GameObjects.Text>(
      ValueName.Level,
    );

    if (levelText) levelText.setText(updatedValue);
  }

  public updateScore(updatedValue: string) {
    const scoreText = this.container.getByName<Phaser.GameObjects.Text>(
      ValueName.Score,
    );

    if (scoreText) scoreText.setText(updatedValue);
  }

  public reset() {
    this.updateLines(DEFAULT_VALUE);
    this.updateLevel(DEFAULT_VALUE);
    this.updateScore(DEFAULT_VALUE);
  }
}
