import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const repository = process.env.GITHUB_REPOSITORY?.split("/")[1];
const base = process.env.LINGOLANKA_BASE_PATH ?? (repository ? `/${repository}/` : "/");

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icon.svg", "apple-touch-icon-180x180.png"],
      manifest: {
        id: ".",
        name: "LingoLanka — Sinhala & English",
        short_name: "LingoLanka",
        description: "Free, private and offline-friendly Sinhala and English learning.",
        theme_color: "#4353b8",
        background_color: "#f7f6f2",
        display: "standalone",
        scope: ".",
        start_url: ".",
        lang: "en",
        categories: ["education"],
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      },
      workbox: {
        navigateFallback: "index.html",
        globPatterns: ["**/*.{js,css,html,svg,png,woff2,mp3}"],
        cleanupOutdatedCaches: true
      }
    })
  ],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    coverage: { reporter: ["text", "html"], include: ["src/**/*.{ts,tsx}"] }
  }
});
