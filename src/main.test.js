import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock svelte's mount function
vi.mock("svelte", () => ({
  mount: vi.fn(() => ({ mocked: "app-instance" })),
}));

// Mock the App component
vi.mock("./App.svelte", () => ({
  default: { name: "MockApp" },
}));

import { mount } from "svelte";
import App from "./App.svelte";

describe("main.js", () => {
  let getElementByIdSpy;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    document.body.innerHTML = '<div id="app"></div>';
    getElementByIdSpy = vi.spyOn(document, "getElementById");
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("calls mount with the App component and the #app target element", async () => {
    await import("./main.js");

    const appElement = document.getElementById("app");
    expect(mount).toHaveBeenCalledTimes(1);
    expect(mount).toHaveBeenCalledWith(App, { target: appElement });
  });

  it("looks up the target element by the correct id", async () => {
    await import("./main.js");

    expect(getElementByIdSpy).toHaveBeenCalledWith("app");
  });

  it("exports the app instance returned by mount", async () => {
    const mod = await import("./main.js");

    expect(mod.default).toEqual({ mocked: "app-instance" });
  });

  it("passes null as target when #app element does not exist in the DOM", async () => {
    document.body.innerHTML = "";

    await import("./main.js");

    expect(mount).toHaveBeenCalledWith(App, { target: null });
  });
});