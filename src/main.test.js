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
    const appElement = document.getElementById("app");
    
    await import("./main.js");

    expect(mount).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        target: appElement,
      })
    );
  });

  it("exports the mounted app instance", async () => {
    const module = await import("./main.js");

    expect(module.default).toBeDefined();
    expect(module.default).toHaveProperty("$destroy");
  });

  it("handles missing #app element gracefully", async () => {
    document.body.innerHTML = "";

    await import("./main.js");

    expect(mount).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        target: null,
      })
    );
  });
});