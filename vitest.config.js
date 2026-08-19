import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte({ hot: false })],
  resolve: {
    conditions: ["browser"],
  },
  test: {
    environment: "jsdom",
    // worker/ is a separate package with its own deps and its own vitest
    // config; running it from here would need worker/node_modules installed.
    exclude: ["**/node_modules/**", "worker/**"],
    globals: true,
    setupFiles: ["./src/test-setup.js"],
    env: {
      VITE_GIF_API_BASE: "https://gif-api.test",
    },
  },
});
