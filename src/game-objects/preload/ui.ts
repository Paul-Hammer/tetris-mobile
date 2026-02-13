import { PreloadScene } from "../../scenes/preload";

const APP_VERSION = import.meta.env.PACKAGE_VERSION;
const FONT_SIZE = 16;
const GAP_BETWEEN_ROWS = 16;
const TEXT_ROWS = [
  [
    { color: "#FFFFFF", word: "TM" },
    { color: "#FFFFFF", word: "AND" },
    { color: "#FFFFFF", word: "COPYRIGHT" },
    { color: "#3CBCFC", word: "2026" },
  ],
  [
    { color: "#3CBCFC", word: "TETRIS" },
    { color: "#3CBCFC", word: "MOBILE" },
  ],
  [
    { color: "#FFFFFF", word: "DESIGNED" },
    { color: "#FFFFFF", word: "AND" },
    { color: "#FFFFFF", word: "PROGRAMED" },
    { color: "#FFFFFF", word: "BY" },
  ],
  [
    { color: "#FFA500", word: "PAUL" },
    { color: "#FFA500", word: "HAMMER" },
  ],
  [
    { color: "#FFFFFF", word: "ALL" },
    { color: "#FFFFFF", word: "RIGHTS" },
    { color: "#FFFFFF", word: "RESERVED" },
  ],
  [{ color: "#FFFFFF", word: `v${APP_VERSION}` }],
];

export class UI {
  private scene: PreloadScene;
  private container: Phaser.GameObjects.Container;

  static textHeight =
    FONT_SIZE * TEXT_ROWS.length + GAP_BETWEEN_ROWS * TEXT_ROWS.length - 1;

  constructor({ scene }: { scene: PreloadScene }) {
    this.scene = scene;

    const y = (this.scene.scale.height - UI.textHeight) / 2;
    const children = TEXT_ROWS.map((words, index) =>
      this.createCenteredColoredText(index * FONT_SIZE, words),
    );

    this.container = new Phaser.GameObjects.Container(
      this.scene,
      0,
      y,
      children,
    );
  }

  create() {
    this.scene.add.existing(this.container);
  }

  private createCenteredColoredText(
    y: number,
    words: { color: string; word: string }[],
  ) {
    const padding = 8;
    const gameWidth = this.scene.scale.width;

    const textObjects: Phaser.GameObjects.Text[] = [];
    let totalWidth = 0;

    words.forEach((word) => {
      const style: Phaser.Types.GameObjects.Text.TextStyle = {
        fontSize: FONT_SIZE,
        fixedHeight: FONT_SIZE,
        fontStyle: "bold",
        color: word.color,
      };

      const t = this.scene.add.text(totalWidth, y, word.word, style);

      textObjects.push(t);
      totalWidth += t.width + padding;
    });

    totalWidth -= padding;

    const startX = (gameWidth - totalWidth) / 2;
    const container = this.scene.add.container(startX, y, textObjects);

    return container;
  }
}
