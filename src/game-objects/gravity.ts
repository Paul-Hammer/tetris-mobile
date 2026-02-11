import Phaser from "phaser";

import { MainScene } from "../scenes/main-scene";

export class Gravity {
  private scene: MainScene;
  private callback: () => void;
  private timerEvent: Phaser.Time.TimerEvent;
  private destroyed: boolean = false;

  constructor({ scene, callback }: { scene: MainScene; callback: () => void }) {
    this.scene = scene;
    this.callback = callback;

    this.timerEvent = this.scene.time.addEvent({
      delay: this.scene.gameState.dropInterval,
      loop: true,
      paused: true,
      callback: this.callback,
      callbackScope: this.scene,
    });
  }

  public start() {
    if (this.destroyed || !this.timerEvent.paused) return;

    this.timerEvent.paused = false;
  }

  public pause() {
    if (this.destroyed || this.timerEvent.paused) return;

    this.timerEvent.paused = true;
  }

  public reset({ delay, paused }: { delay: number; paused: boolean }) {
    if (this.destroyed) return;

    this.timerEvent.reset({
      delay,
      loop: true,
      paused,
      callback: this.callback,
      callbackScope: this.scene,
    });
  }

  public isPaused() {
    if (this.destroyed) return true;

    return this.timerEvent.paused;
  }

  public isDestroyed() {
    return this.destroyed;
  }

  public destroy() {
    this.destroyed = true;
    this.timerEvent.destroy();
  }
}
