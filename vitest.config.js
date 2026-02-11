import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte({ hot: false })],
  resolve: {
    conditions: ["browser"],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test-setup.js"],
    env: {
      VITE_GIPHY_API_KEY: "test-giphy-key",
      VITE_TENOR_API_KEY: "test-tenor-key",
    },
  },
});
