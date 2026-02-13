import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

import packageJson from "./package.json";

export default defineConfig({
  base: "/tetris-mobile/",
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json}"],
        maximumFileSizeToCacheInBytes: 3000000,
      },
      manifest: {
        name: "Tetris Mobile Game",
        short_name: "Tetris",
        description: "Classic Tetris built with Phaser and TS",
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
  define: {
    "import.meta.env.PACKAGE_VERSION": JSON.stringify(packageJson.version),
  },
});
