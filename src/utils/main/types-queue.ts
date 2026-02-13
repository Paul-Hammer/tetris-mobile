import Phaser from "phaser";

import { TetrominoType } from "../../types";

export class TypesQueue {
  public _queue: TetrominoType[] = [];

  private getRandomType() {
    const values = Object.values(TetrominoType);

    return Phaser.Utils.Array.GetRandom(values);
  }

  public create() {
    this._queue = [
      this.getRandomType(),
      this.getRandomType(),
      this.getRandomType(),
    ];
  }

  public get queue(): readonly TetrominoType[] {
    return this._queue;
  }

  public getNext() {
    const next = this._queue.shift();

    if (next) {
      this._queue.push(this.getRandomType());

      return next;
    } else {
      throw new Error("Queue is empty. Use create method first.");
    }
  }
}
