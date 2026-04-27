import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "svelte";

// Mock the svelte mount function
vi.mock("svelte", () => ({
  mount: vi.fn(),
}));

// Mock the App component
vi.mock("./App.svelte", () => ({
  default: {},
}));

describe("main", () => {
  let mockApp;
  let mockGetElementById;
  let originalGetElementById;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Mock document.getElementById
    mockApp = { id: "app" };
    mockGetElementById = vi.fn(() => mockApp);
    originalGetElementById = document.getElementById;
    document.getElementById = mockGetElementById;

    // Mock mount to return a mock app instance
    mount.mockReturnValue({ $set: vi.fn(), $destroy: vi.fn() });
  });

  afterEach(() => {
    // Restore original getElementById
    document.getElementById = originalGetElementById;
  });

  it("mounts the App component with the correct target", async () => {
    await import("./main.js?t=" + Date.now());

    expect(mockGetElementById).toHaveBeenCalledWith("app");
    expect(mount).toHaveBeenCalled();
    expect(mount.mock.calls[0][1]).toEqual({ target: mockApp });
  });

  it("exports the mounted app instance", async () => {
    const appInstance = { $set: vi.fn(), $destroy: vi.fn() };
    mount.mockReturnValue(appInstance);

    const module = await import("./main.js?t=" + Date.now());
    
    expect(module.default).toBeDefined();
  });

  it("calls mount with App component as first argument", async () => {
    const { default: App } = await import("./App.svelte");
    await import("./main.js?t=" + Date.now());

    expect(mount).toHaveBeenCalledWith(App, expect.any(Object));
  });

  it("handles when app element does not exist", async () => {
    document.getElementById = vi.fn(() => null);

    await import("./main.js?t=" + Date.now());

    expect(mount).toHaveBeenCalledWith(expect.anything(), { target: null });
  });
});