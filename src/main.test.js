import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock svelte's mount function
vi.mock("svelte", () => ({
  mount: vi.fn(() => ({ mocked: "app-instance" })),
}));

// Mock the App component
vi.mock("./App.svelte", () => ({
  default: { name: "MockApp" },
}));

describe("main.js", () => {
  let getElementByIdSpy;

  beforeEach(() => {
    // Ensure a clean DOM and module cache for each test
    document.body.innerHTML = '<div id="app"></div>';
    getElementByIdSpy = vi.spyOn(document, "getElementById");
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("calls mount with the App component and the #app target element", async () => {
    const { mount } = await import("svelte");
    const App = (await import("./App.svelte")).default;

    await import("./main.js");

    const target = document.getElementById("app");

    expect(mount).toHaveBeenCalledTimes(1);
    expect(mount).toHaveBeenCalledWith(App, { target });
  });

  it("exports the result of mount as the default export", async () => {
    const { mount } = await import("svelte");
    mount.mockReturnValueOnce({ mocked: "unique-instance" });

    const mainModule = await import("./main.js");

    expect(mainModule.default).toEqual({ mocked: "unique-instance" });
  });

  it("looks up the target element using the 'app' id", async () => {
    await import("./main.js");

    expect(getElementByIdSpy).toHaveBeenCalledWith("app");
  });

  it("passes null as target when the #app element does not exist", async () => {
    document.body.innerHTML = "";

    const { mount } = await import("svelte");
    const App = (await import("./App.svelte")).default;

    await import("./main.js");

    expect(mount).toHaveBeenCalledWith(App, { target: null });
  });
});