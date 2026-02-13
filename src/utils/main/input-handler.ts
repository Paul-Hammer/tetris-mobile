import { MainScene } from "../../scenes/main";
import { Piece } from "../../game-objects/main/piece";
import { CollisionDetection } from "./collision-detection";
import type { TetrominoType } from "../../types";
import { CollisionEvent } from "../../events";
import { SHAPES } from "../../constants";

export class InputHandler {
  private scene: MainScene;
  private collisionDetection: CollisionDetection;

  constructor({ scene }: { scene: MainScene }) {
    this.scene = scene;
    this.collisionDetection = new CollisionDetection();
  }

  public moveLeft(activePiece: Piece, boardData: (TetrominoType | null)[][]) {
    const dx = -1;

    const canMoveLeft = this.collisionDetection.canMove(
      activePiece.x + dx,
      activePiece.y,
      activePiece.shape,
      boardData,
    );

    if (canMoveLeft) activePiece.moveSide(dx);
  }

  public moveRight(activePiece: Piece, boardData: (TetrominoType | null)[][]) {
    const dx = 1;

    const canMoveLeft = this.collisionDetection.canMove(
      activePiece.x + dx,
      activePiece.y,
      activePiece.shape,
      boardData,
    );

    if (canMoveLeft) activePiece.moveSide(dx);
  }

  public rotate(activePiece: Piece, boardData: (TetrominoType | null)[][]) {
    const nextRotation = (activePiece.currentRotation + 1) % 4;
    const nextShape = SHAPES[activePiece.type][nextRotation];
    // Order of this array does matter
    const offsets = [0, -1, 1, -2, 2];

    for (const dx of offsets) {
      const canMove = this.collisionDetection.canMove(
        activePiece.x + dx,
        activePiece.y,
        nextShape,
        boardData,
      );

      if (canMove) {
        if (dx !== 0) activePiece.moveSide(dx);
        activePiece.rotate();

        return;
      }

      console.log("Can not rotate even with wall kick...");
    }
  }

  public hardDrop(activePiece: Piece, boardData: (TetrominoType | null)[][]) {
    let linesToDrop = 0;

    while (
      this.collisionDetection.canMove(
        activePiece.x,
        activePiece.y + 1,
        activePiece.shape,
        boardData,
      )
    ) {
      activePiece.moveDown();
      linesToDrop++;
    }

    this.scene.events.emit(CollisionEvent);
  }

  public moveDown(activePiece: Piece, boardData: (TetrominoType | null)[][]) {
    const canMoveDown = this.collisionDetection.canMove(
      activePiece.x,
      activePiece.y + 1,
      activePiece.shape,
      boardData,
    );

    if (canMoveDown) activePiece.moveDown();
    else this.scene.events.emit(CollisionEvent);
  }
}
