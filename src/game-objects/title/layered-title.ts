import Phaser from "phaser";

import { TitleScene } from "../../scenes/title";

export class LayeredTitle {
  private scene: TitleScene;
  private container: Phaser.GameObjects.Container;

  static height = 120;
  static coloredLayerName = "colored-layer";

  constructor({ scene }: { scene: TitleScene }) {
    this.scene = scene;

    const gameWidth = this.scene.scale.width;
    const gameHeight = this.scene.scale.height;

    const x = gameWidth / 2;
    const y =
      (gameHeight - LayeredTitle.height - TitleScene.gapBetweenTitleAndButton) /
      2;

    const layers = [
      this.scene.add
        .image(0, 0, "game-title", 0)
        .setOrigin(0.5)
        .setName(LayeredTitle.coloredLayerName),
      this.scene.add.image(0, 0, "game-title", 1).setOrigin(0.5),
      this.scene.add.image(0, 0, "game-title", 2).setOrigin(0.5),
    ];

    this.container = new Phaser.GameObjects.Container(this.scene, x, y, layers);
  }

  public create() {
    this.scene.add.existing(this.container);

    const colors = this.shuffleArray([
      0x4a4ae6, 0xf83800, 0x58f898, 0x00a800, 0x6b0505, 0xd800d8, 0xe40058,
      0x3cbcfc, 0x58f858, 0x6888ff, 0x7c7c7c, 0xa80020, 0xb8f818, 0xf878f8,
      0xffa500,
    ]);

    const coloredLayer = this.container.getByName(
      LayeredTitle.coloredLayerName,
    );

    if (coloredLayer instanceof Phaser.GameObjects.Image) {
      this.scene.tweens.addCounter({
        from: 0,
        to: colors.length - 1,
        duration: colors.length * 1000,
        ease: "Linear",
        repeat: -1,
        yoyo: true,
        onUpdate: (tween) => {
          const value = tween.getValue();

          if (!value) return;

          const currentIndex = Math.floor(value);
          const nextIndex = (currentIndex + 1) % colors.length;
          const interpolationProgress = (value % 1) * 100;

          const [colorA, colorB] = [
            colors[currentIndex],
            colors[nextIndex],
          ].map(Phaser.Display.Color.ValueToColor);

          const { r, g, b } = this.interpolateColors(
            colorA,
            colorB,
            interpolationProgress,
          );

          coloredLayer.setTint(this.interpolatedColorToHex(r, g, b));
        },
      });
    }
  }

  private interpolateColors(
    colorA: Phaser.Display.Color,
    colorB: Phaser.Display.Color,
    progress: number,
  ) {
    return Phaser.Display.Color.Interpolate.ColorWithColor(
      colorA,
      colorB,
      100,
      progress,
    );
  }

  private interpolatedColorToHex(r: number, g: number, b: number) {
    return Phaser.Display.Color.GetColor(r, g, b);
  }

  private shuffleArray<T>(array: T[]) {
    const copiedArray = [...array];

    Phaser.Utils.Array.Shuffle(copiedArray);

    return copiedArray;
  }
}
