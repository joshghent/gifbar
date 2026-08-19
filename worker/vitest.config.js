import { defineConfig } from "vitest/config";

// Own config so the Worker tests do not inherit the app's jsdom environment
// and Svelte setup from the repo root.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.js"],
  },
});
