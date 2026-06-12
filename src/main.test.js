import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "svelte";

// Mock the App component
vi.mock("./App.svelte", () => ({
  default: vi.fn(),
}));

// Mock the mount function from svelte
vi.mock("svelte", () => ({
  mount: vi.fn(() => ({ testApp: true })),
}));

describe("main", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '<div id="app"></div>';
  });

  it("mounts the App component to the #app element", async () => {
    const { default: App } = await import("./App.svelte");
    
    // Re-import main to trigger the mount
    await import("./main.js");

    const appElement = document.getElementById("app");
    expect(mount).toHaveBeenCalledWith(App, { target: appElement });
  });

  it("exports the mounted app instance", async () => {
    const app = await import("./main.js");
    
    expect(app.default).toBeDefined();
    expect(app.default).toEqual({ testApp: true });
  });

  it("handles missing app element gracefully", async () => {
    document.body.innerHTML = "";
    
    const { default: App } = await import("./App.svelte");
    
    // Clear the module cache to re-run the mount
    vi.resetModules();
    
    await import("./main.js");

    expect(mount).toHaveBeenCalledWith(App, { target: null });
  });
});