import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/tetris-mobile/",
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["assets/**/*.png", "assets/**/*.svg", "favicon.ico"],
      manifest: {
        name: "Tetris Mobile",
        short_name: "Tetris",
        description: "Classic Tetris game built with Phaser and TypeScript",
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        orientation: "portrait",
        icons: [
          {
            src: "assets/icons/tetris-icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "assets/icons/tetris-icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "assets/icons/tetris-icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
