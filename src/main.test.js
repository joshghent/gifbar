import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "svelte";

// Mock the App component
vi.mock("./App.svelte", () => ({
  default: {},
}));

// Mock the mount function from svelte
vi.mock("svelte", () => ({
  mount: vi.fn(),
}));

describe("main", () => {
  let mockAppElement;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create a mock DOM element
    mockAppElement = document.createElement("div");
    mockAppElement.id = "app";
    document.body.appendChild(mockAppElement);
    
    // Mock getElementById to return our element
    vi.spyOn(document, "getElementById").mockReturnValue(mockAppElement);
  });

  it("mounts the App component with correct target", async () => {
    const mockApp = { $destroy: vi.fn() };
    mount.mockReturnValue(mockApp);

    // Import the module to trigger the mount
    await import("./main.js");

    expect(document.getElementById).toHaveBeenCalledWith("app");
    expect(mount).toHaveBeenCalledWith(
      expect.anything(),
      { target: mockAppElement }
    );
  });

  it("exports the mounted app instance", async () => {
    const mockApp = { $destroy: vi.fn() };
    mount.mockReturnValue(mockApp);

    const module = await import("./main.js");

    expect(module.default).toBe(mockApp);
  });

  it("handles missing app element gracefully", async () => {
    document.getElementById.mockReturnValue(null);

    await import("./main.js");

    expect(mount).toHaveBeenCalledWith(
      expect.anything(),
      { target: null }
    );
  });
});