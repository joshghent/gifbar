import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "svelte";

// Mock the mount function from svelte
vi.mock("svelte", () => ({
  mount: vi.fn(),
}));

// Mock the App component
vi.mock("./App.svelte", () => ({
  default: {},
}));

describe("main", () => {
  let mockAppElement;
  let mockMountedApp;

  beforeEach(() => {
    // Create a mock app element
    mockAppElement = document.createElement("div");
    mockAppElement.id = "app";
    document.body.appendChild(mockAppElement);

    // Mock the mounted app instance
    mockMountedApp = { $destroy: vi.fn() };
    mount.mockReturnValue(mockMountedApp);

    // Clear module cache to re-import main.js
    vi.resetModules();
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
  });

  it("mounts the App component to the #app element", async () => {
    const App = (await import("./App.svelte")).default;
    await import("./main.js");

    expect(mount).toHaveBeenCalledWith(App, {
      target: mockAppElement,
    });
  });

  it("exports the mounted app instance", async () => {
    const main = await import("./main.js");

    expect(main.default).toBe(mockMountedApp);
  });

  it("calls mount with correct target when #app exists", async () => {
    const App = (await import("./App.svelte")).default;
    await import("./main.js");

    const callArgs = mount.mock.calls[0];
    expect(callArgs[0]).toBe(App);
    expect(callArgs[1].target).toBe(mockAppElement);
  });

  it("handles missing #app element gracefully", async () => {
    document.body.innerHTML = "";
    
    const App = (await import("./App.svelte")).default;
    await import("./main.js");

    expect(mount).toHaveBeenCalledWith(App, {
      target: null,
    });
  });
});