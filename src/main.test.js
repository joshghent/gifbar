import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "svelte";

// Mock the App component
vi.mock("./App.svelte", () => ({
  default: {},
}));

// Mock the mount function
vi.mock("svelte", () => ({
  mount: vi.fn(),
}));

describe("main.js", () => {
  let mockAppElement;
  let originalGetElementById;

  beforeEach(() => {
    // Create a mock app element
    mockAppElement = document.createElement("div");
    mockAppElement.id = "app";
    
    // Save original and mock getElementById
    originalGetElementById = document.getElementById;
    document.getElementById = vi.fn(() => mockAppElement);
    
    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original getElementById
    document.getElementById = originalGetElementById;
    vi.resetModules();
  });

  it("mounts the App component to the #app element", async () => {
    const mockApp = { $set: vi.fn(), $destroy: vi.fn() };
    mount.mockReturnValue(mockApp);

    // Import main.js to trigger the mount
    await import("./main.js");

    expect(document.getElementById).toHaveBeenCalledWith("app");
    expect(mount).toHaveBeenCalledWith(expect.anything(), {
      target: mockAppElement,
    });
  });

  it("exports the mounted app instance", async () => {
    const mockApp = { $set: vi.fn(), $destroy: vi.fn() };
    mount.mockReturnValue(mockApp);

    const main = await import("./main.js");

    expect(main.default).toBe(mockApp);
  });

  it("handles missing app element gracefully", async () => {
    document.getElementById = vi.fn(() => null);
    const mockApp = { $set: vi.fn(), $destroy: vi.fn() };
    mount.mockReturnValue(mockApp);

    await import("./main.js");

    expect(mount).toHaveBeenCalledWith(expect.anything(), {
      target: null,
    });
  });
});