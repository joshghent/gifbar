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

describe("main.js", () => {
  let mockAppElement;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create a mock app element
    mockAppElement = document.createElement("div");
    mockAppElement.id = "app";
    document.body.appendChild(mockAppElement);
    
    // Mock getElementById
    vi.spyOn(document, "getElementById").mockReturnValue(mockAppElement);
  });

  it("mounts the App component to the #app element", async () => {
    const mockAppInstance = { _instance: "mock-app" };
    mount.mockReturnValue(mockAppInstance);

    // Dynamically import to trigger the mount
    await import("./main.js");

    expect(document.getElementById).toHaveBeenCalledWith("app");
    expect(mount).toHaveBeenCalledWith(expect.any(Object), {
      target: mockAppElement,
    });
  });

  it("exports the mounted app instance", async () => {
    const mockAppInstance = { _instance: "mock-app" };
    mount.mockReturnValue(mockAppInstance);

    const main = await import("./main.js");

    expect(main.default).toBe(mockAppInstance);
  });

  it("handles missing app element gracefully", async () => {
    document.getElementById.mockReturnValue(null);

    await import("./main.js");

    expect(mount).toHaveBeenCalledWith(expect.any(Object), {
      target: null,
    });
  });
});