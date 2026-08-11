import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("svelte", () => ({
  mount: vi.fn(() => ({ mocked: "app-instance" })),
}));

vi.mock("./App.svelte", () => ({
  default: class MockApp {},
}));

describe("main.js", () => {
  let originalGetElementById;

  beforeEach(() => {
    vi.resetModules();
    originalGetElementById = document.getElementById;
  });

  afterEach(() => {
    document.getElementById = originalGetElementById;
    document.body.innerHTML = "";
    vi.clearAllMocks();
  });

  it("mounts the App component to the #app element", async () => {
    const target = document.createElement("div");
    target.id = "app";
    document.body.appendChild(target);

    const { mount } = await import("svelte");
    const App = (await import("./App.svelte")).default;

    await import("./main.js");

    expect(mount).toHaveBeenCalledTimes(1);
    expect(mount).toHaveBeenCalledWith(App, { target });
  });

  it("exports the mounted app instance as default", async () => {
    const target = document.createElement("div");
    target.id = "app";
    document.body.appendChild(target);

    const { mount } = await import("svelte");
    mount.mockReturnValue({ mocked: "app-instance" });

    const mainModule = await import("./main.js");

    expect(mainModule.default).toEqual({ mocked: "app-instance" });
  });

  it("calls document.getElementById with 'app'", async () => {
    const target = document.createElement("div");
    target.id = "app";
    document.body.appendChild(target);

    const spy = vi.spyOn(document, "getElementById");

    await import("./main.js");

    expect(spy).toHaveBeenCalledWith("app");
  });

  it("passes null as target when #app element does not exist", async () => {
    // No element appended to document.body

    const { mount } = await import("svelte");
    const App = (await import("./App.svelte")).default;

    await import("./main.js");

    expect(mount).toHaveBeenCalledWith(App, { target: null });
  });
});