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

describe("main", () => {
  let mockAppElement;
  let mockAppInstance;

  beforeEach(() => {
    // Create a mock DOM element
    mockAppElement = document.createElement("div");
    mockAppElement.id = "app";
    document.body.appendChild(mockAppElement);

    // Create a mock app instance
    mockAppInstance = { $destroy: vi.fn() };

    // Mock getElementById
    vi.spyOn(document, "getElementById");

    // Reset the mount mock
    mount.mockReturnValue(mockAppInstance);
  });

  afterEach(() => {
    // Clean up the DOM
    if (mockAppElement && mockAppElement.parentNode) {
      mockAppElement.parentNode.removeChild(mockAppElement);
    }
    vi.clearAllMocks();
  });

  it("mounts the App component to the #app element", async () => {
    // Import after mocks are set up
    const { default: App } = await import("./App.svelte");
    
    // Re-import main to trigger the mount
    await import("./main.js");

    expect(document.getElementById).toHaveBeenCalledWith("app");
    expect(mount).toHaveBeenCalledWith(App, { target: mockAppElement });
  });

  it("exports the mounted app instance", async () => {
    const main = await import("./main.js");
    
    expect(main.default).toBe(mockAppInstance);
  });

  it("handles missing app element gracefully", async () => {
    // Remove the app element
    document.body.removeChild(mockAppElement);
    vi.spyOn(document, "getElementById").mockReturnValue(null);

    // This would normally throw, but we're testing the behavior
    await import("./main.js");

    expect(mount).toHaveBeenCalledWith(expect.anything(), { target: null });
  });
});