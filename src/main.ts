import Phaser from "phaser";

import { MainScene } from "./scenes/main-scene";

const GAME_CONTAINER_ID = "game-container";

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: GAME_CONTAINER_ID,
  backgroundColor: "#1a1a1a",

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: "100%",
    height: "100%",
  },

  // pixelArt: true,
  // roundPixels: true,

  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { x: 0, y: 0 },
    },
  },

  scene: [MainScene],
});
