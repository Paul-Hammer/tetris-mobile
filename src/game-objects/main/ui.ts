import { MainScene } from "../../scenes/main";
import { Background } from "./background";
import { Board } from "./board";
import { Controls } from "./controls";
import { NextPiece } from "./next-piece";
import { Stats } from "./stats";

export class UI {
  private scene: MainScene;

  public components: {
    background: Background;
    board: Board;
    stats: Stats;
    nextPiece: NextPiece;
    controls: Controls;
  };

  constructor({ scene }: { scene: MainScene }) {
    this.scene = scene;

    const gameWidth = this.scene.scale.width;
    const gameHeight = this.scene.scale.height;

    const background = new Background({
      scene: this.scene,
      position: { x: 0, y: 0 },
    });

    const board = new Board({
      scene: this.scene,
      position: {
        x: (gameWidth - Board.width) / 2,
        y: (gameHeight - Board.height) / 2,
      },
    });

    const stats = new Stats({
      scene: this.scene,
      position: {
        x: (gameWidth - Stats.width) / 2,
        y: board.position.y - Stats.marginBottom - Stats.height,
      },
    });

    const nextPiece = new NextPiece({
      scene: this.scene,
      position: {
        x: board.position.x + Board.width + NextPiece.marginLeft,
        y: board.position.y + NextPiece.marginTop,
      },
    });

    const controls = new Controls({
      scene: this.scene,
      position: {
        x: (gameWidth - Controls.width) / 2,
        y: board.position.y + Board.height + Controls.marginTop,
      },
    });

    this.components = { background, board, stats, nextPiece, controls };
  }

  public create() {
    this.components.background.create();
    this.components.board.create();
    this.components.stats.create();
    this.components.nextPiece.create();
    this.components.controls.create();
  }

  public update() {
    this.components.board.update();
    this.components.stats.update();
    this.components.nextPiece.update();
  }
}
