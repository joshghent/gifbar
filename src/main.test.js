import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "svelte";

vi.mock("svelte", () => ({
  mount: vi.fn(),
}));

vi.mock("./App.svelte", () => ({
  default: {},
}));

describe("main", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '<div id="app"></div>';
  });

  it("mounts the App component to the target element", async () => {
    const mockApp = { $destroy: vi.fn() };
    mount.mockReturnValue(mockApp);

    await import("./main.js");

    expect(mount).toHaveBeenCalledWith(
      expect.anything(),
      { target: document.getElementById("app") }
    );
  });

  it("exports the mounted app instance", async () => {
    const mockApp = { $destroy: vi.fn() };
    mount.mockReturnValue(mockApp);

    const module = await import("./main.js");

    expect(module.default).toBe(mockApp);
  });

  it("uses the correct DOM element as target", async () => {
    const mockApp = { $destroy: vi.fn() };
    mount.mockReturnValue(mockApp);
    const appElement = document.getElementById("app");

    await import("./main.js");

    expect(mount).toHaveBeenCalledWith(
      expect.anything(),
      { target: appElement }
    );
  });
});