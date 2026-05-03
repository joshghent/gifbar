import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "svelte";
import App from "./App.svelte";

// Mock the svelte mount function
vi.mock("svelte", () => ({
  mount: vi.fn(),
}));

// Mock the App component
vi.mock("./App.svelte", () => ({
  default: {},
}));

describe("main.js", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '<div id="app"></div>';
  });

  it("mounts the App component to the #app element", async () => {
    const mockAppInstance = { $destroy: vi.fn() };
    mount.mockReturnValue(mockAppInstance);

    // Re-import to trigger the mount
    await import("./main.js?t=" + Date.now());

    expect(mount).toHaveBeenCalledWith(App, {
      target: document.getElementById("app"),
    });
  });

  it("exports the mounted app instance", async () => {
    const mockAppInstance = { $destroy: vi.fn() };
    mount.mockReturnValue(mockAppInstance);

    const module = await import("./main.js?t=" + Date.now());

    expect(module.default).toBe(mockAppInstance);
  });

  it("uses the correct target element", async () => {
    const mockAppInstance = { $destroy: vi.fn() };
    mount.mockReturnValue(mockAppInstance);
    const appElement = document.getElementById("app");

    await import("./main.js?t=" + Date.now());

    expect(mount).toHaveBeenCalledWith(App, {
      target: appElement,
    });
  });
});