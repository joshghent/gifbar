import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "svelte";

vi.mock("svelte", () => ({
  mount: vi.fn(),
}));

vi.mock("./App.svelte", () => ({
  default: {},
}));

describe("main.js", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules(); // Clear module cache to allow fresh imports
    document.body.innerHTML = '<div id="app"></div>';
  });

  it("mounts the App component to the #app element", async () => {
    const mockApp = { $destroy: vi.fn() };
    mount.mockReturnValue(mockApp);

    await import("./main.js");

    expect(mount).toHaveBeenCalledTimes(1);
    expect(mount).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        target: document.getElementById("app"),
      })
    );
  });

  it("exports the mounted app instance", async () => {
    const mockApp = { $destroy: vi.fn() };
    mount.mockReturnValue(mockApp);

    const module = await import("./main.js");

    expect(module.default).toBe(mockApp);
  });

  it("uses the correct target element", async () => {
    const mockApp = { $destroy: vi.fn() };
    mount.mockReturnValue(mockApp);
    const appElement = document.getElementById("app");

    await import("./main.js");

    const callArgs = mount.mock.calls[0];
    expect(callArgs[1].target).toBe(appElement);
  });
});
