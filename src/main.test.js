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

  it("mounts the App component to the #app element", async () => {
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

    const { default: app } = await import("./main.js?t=" + Date.now());

    expect(app).toBe(mockApp);
  });

  it("calls mount with correct target element", async () => {
    const appElement = document.getElementById("app");
    mount.mockReturnValue({});

    await import("./main.js?t=" + Date.now());

    expect(mount).toHaveBeenCalledWith(
      expect.anything(),
      { target: appElement }
    );
  });
});