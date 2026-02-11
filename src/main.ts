import Phaser from "phaser";
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("Доступно обновление игры. Обновить?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("Игра готова к работе без интернета!");
  },
});

import { MainScene } from "./scenes/main-scene";

const GAME_CONTAINER_ID = "game-container";

new Phaser.Game({
  type: Phaser.AUTO,
  parent: GAME_CONTAINER_ID,
  backgroundColor: "#1a1a1a",

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: "100%",
    height: "100%",
  },

  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { x: 0, y: 0 },
    },
  },

  scene: [MainScene],
});
