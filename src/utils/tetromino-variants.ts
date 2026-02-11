import { FRAMES } from "../constants";

export class TetrominoVariants {
  private _current = 9;

  public get current() {
    return this._current;
  }

  public next() {
    this._current = this._current === FRAMES.length - 1 ? 0 : this._current + 1;

    return this._current;
  }

  public reset() {
    this._current = 0;
  }
}
