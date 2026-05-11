import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "svelte";

// Mock the App component
vi.mock("./App.svelte", () => ({
  default: vi.fn(),
}));

// Mock the mount function
vi.mock("svelte", () => ({
  mount: vi.fn(),
}));

describe("main", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup DOM
    document.body.innerHTML = '<div id="app"></div>';
  });

  it("mounts the App component to the #app element", async () => {
    const mockAppInstance = { $destroy: vi.fn() };
    mount.mockReturnValue(mockAppInstance);

    // Import main to trigger mount
    await import("./main.js");

    expect(mount).toHaveBeenCalled();
    const mountCall = mount.mock.calls[mount.mock.calls.length - 1];
    expect(mountCall[1]).toEqual({ target: document.getElementById("app") });
  });

  it("exports the app instance", async () => {
    const mockAppInstance = { $destroy: vi.fn() };
    mount.mockReturnValue(mockAppInstance);

    const mainModule = await import("./main.js");

    expect(mainModule.default).toBe(mockAppInstance);
  });

  it("calls mount with correct target element", async () => {
    const mockAppInstance = { $destroy: vi.fn() };
    mount.mockReturnValue(mockAppInstance);

    await import("./main.js");

    const mountCall = mount.mock.calls[mount.mock.calls.length - 1];
    expect(mountCall[1].target).toBe(document.getElementById("app"));
  });
});