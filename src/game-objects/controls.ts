import Phaser from "phaser";

import { MainScene } from "../scenes/main-scene";
import { ControlsFrame, type Position } from "../types";
import { ControlsEvent } from "../events";

export class Controls {
  private scene: MainScene;
  private container: Phaser.GameObjects.Container;

  public isDrawn: boolean = false;
  public position: Position;

  static width = 340;
  static height = 44;
  static marginTop = 20;
  static buttonWidth = 60;
  static buttonsGap = 10;

  constructor({ scene, position }: { scene: MainScene; position: Position }) {
    this.scene = scene;
    this.position = position;
    this.container = new Phaser.GameObjects.Container(
      this.scene,
      this.position.x,
      this.position.y,
    );
  }

  private setupEvents({
    moveLeft,
    moveRight,
    rotate,
    hardDrop,
    softDrop,
  }: {
    moveLeft: Phaser.GameObjects.Sprite;
    moveRight: Phaser.GameObjects.Sprite;
    rotate: Phaser.GameObjects.Sprite;
    hardDrop: Phaser.GameObjects.Sprite;
    softDrop: Phaser.GameObjects.Sprite;
  }) {
    const interactiveButtons = [
      moveLeft,
      hardDrop,
      rotate,
      softDrop,
      moveRight,
    ];

    interactiveButtons.forEach((btn) =>
      btn.setInteractive({ useHandCursor: true }),
    );

    // Rotate tap
    rotate.on("pointerdown", () => {
      this.scene.events.emit(ControlsEvent.Rotate);
    });

    // Hard drop tap
    hardDrop.on("pointerdown", () => {
      this.scene.events.emit(ControlsEvent.HardDrop);
    });

    // Move left + holding and canceling
    this.setupHoldableButton(
      moveLeft,
      ControlsEvent.MoveLeft,
      ControlsEvent.StopMoveLeft,
    );

    // Move right + holding and canceling
    this.setupHoldableButton(
      moveRight,
      ControlsEvent.MoveRight,
      ControlsEvent.StopMoveRight,
    );

    // Soft drop + holding and canceling
    this.setupHoldableButton(
      softDrop,
      ControlsEvent.SoftDrop,
      ControlsEvent.StopSoftDrop,
    );
  }

  private setupHoldableButton(
    btn: Phaser.GameObjects.Sprite,
    startEvent: ControlsEvent,
    stopEvent?: ControlsEvent,
  ) {
    btn.on("pointerdown", () => {
      this.scene.events.emit(startEvent);
    });

    btn.on("pointerup", () => {
      if (stopEvent) this.scene.events.emit(stopEvent);
    });

    btn.on("pointerout", () => {
      if (stopEvent) this.scene.events.emit(stopEvent);
    });
  }

  public create() {
    const buttons = this.createButtons();

    this.container.add(Object.values(buttons));
    this.scene.add.existing(this.container);
    this.setupEvents(buttons);
  }

  private createButtons() {
    const { Left, Up, Rotate, Down, Right } = ControlsFrame;

    const baseWidth = Controls.buttonWidth + Controls.buttonsGap;
    const texture = "controls";

    const moveLeft = this.scene.add
      .sprite(0 * baseWidth, 0, texture, Left)
      .setOrigin(0);
    const hardDrop = this.scene.add
      .sprite(1 * baseWidth, 0, texture, Up)
      .setOrigin(0);
    const rotate = this.scene.add
      .sprite(2 * baseWidth, 0, texture, Rotate)
      .setOrigin(0);
    const softDrop = this.scene.add
      .sprite(3 * baseWidth, 0, texture, Down)
      .setOrigin(0);
    const moveRight = this.scene.add
      .sprite(4 * baseWidth, 0, texture, Right)
      .setOrigin(0);

    return { hardDrop, rotate, softDrop, moveRight, moveLeft };
  }
}
