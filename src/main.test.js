import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "svelte";
import App from "./App.svelte";

vi.mock("svelte", () => ({
  mount: vi.fn(),
}));

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

    await import("./main.js");

    expect(mount).toHaveBeenCalledWith(App, {
      target: document.getElementById("app"),
    });
  });

  it("exports the mounted app instance", async () => {
    const mockAppInstance = { $destroy: vi.fn() };
    mount.mockReturnValue(mockAppInstance);

    const module = await import("./main.js");

    expect(module.default).toBe(mockAppInstance);
  });

  it("uses the correct DOM target element", async () => {
    const appElement = document.getElementById("app");
    const mockAppInstance = { $destroy: vi.fn() };
    mount.mockReturnValue(mockAppInstance);

    await import("./main.js");

    const mountCall = mount.mock.calls[0];
    expect(mountCall[1].target).toBe(appElement);
  });
});