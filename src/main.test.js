import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "svelte";

// Mock the App component
vi.mock("./App.svelte", () => ({
  default: {},
}));

// Mock the mount function
vi.mock("svelte", () => ({
  mount: vi.fn(() => ({ $destroy: vi.fn() })),
}));

describe("main.js", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup DOM
    document.body.innerHTML = '<div id="app"></div>';
  });

  it("mounts the App component to the #app element", async () => {
    const { default: App } = await import("./App.svelte");
    
    // Re-import main to trigger the mount
    await import("./main.js");

    expect(mount).toHaveBeenCalledWith(App, {
      target: document.getElementById("app"),
    });
  });

  it("exports the mounted app instance", async () => {
    const module = await import("./main.js");
    
    expect(module.default).toBeDefined();
    expect(module.default).toHaveProperty("$destroy");
  });

  it("handles missing #app element gracefully", async () => {
    document.body.innerHTML = "";
    
    // Clear module cache to re-run main.js
    vi.resetModules();
    
    await import("./main.js");

    expect(mount).toHaveBeenCalledWith(expect.anything(), {
      target: null,
    });
  });
});