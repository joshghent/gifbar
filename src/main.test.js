import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("svelte", () => ({
  mount: vi.fn(() => ({ mocked: "app-instance" })),
}));

vi.mock("./App.svelte", () => ({
  default: class MockApp {},
}));

describe("main.js", () => {
  beforeEach(() => {
    vi.resetModules();
    const target = document.createElement("div");
    target.id = "app";
    document.body.appendChild(target);
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
  });

  it("mounts the App component into #app", async () => {
    const { mount } = await import("svelte");
    const App = (await import("./App.svelte")).default;

    await import("./main.js");

    expect(mount).toHaveBeenCalledTimes(1);
    expect(mount).toHaveBeenCalledWith(App, {
      target: document.getElementById("app"),
    });
  });

  it("exports the mounted app instance as default", async () => {
    const mainModule = await import("./main.js");

    expect(mainModule.default).toEqual({ mocked: "app-instance" });
  });
});
