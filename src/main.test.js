import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "svelte";
import App from "./App.svelte";

vi.mock("svelte", () => ({
  mount: vi.fn(() => ({ _instance: "app" })),
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
    await import("./main.js");

    expect(mount).toHaveBeenCalledWith(App, {
      target: document.getElementById("app"),
    });
  });

  it("exports the mounted app instance", async () => {
    const module = await import("./main.js");

    expect(module.default).toBeDefined();
    expect(module.default).toEqual({ _instance: "app" });
  });

  it("uses the correct target element from DOM", async () => {
    const appElement = document.getElementById("app");
    await import("./main.js");

    expect(mount).toHaveBeenCalledWith(
      App,
      expect.objectContaining({ target: appElement })
    );
  });
});