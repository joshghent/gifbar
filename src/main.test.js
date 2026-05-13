import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "svelte";

// Mock the App component
vi.mock("./App.svelte", () => ({
  default: vi.fn(),
}));

// Mock the mount function from svelte
vi.mock("svelte", () => ({
  mount: vi.fn(),
}));

describe("main", () => {
  let mockApp;
  let mockElement;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup mock DOM element
    mockElement = document.createElement("div");
    mockElement.id = "app";
    document.body.appendChild(mockElement);
    
    vi.spyOn(document, "getElementById").mockReturnValue(mockElement);
    
    // Setup mock app instance
    mockApp = {
      $set: vi.fn(),
      $destroy: vi.fn(),
    };
    
    mount.mockReturnValue(mockApp);
  });

  it("mounts the App component to the #app element", async () => {
    const App = (await import("./App.svelte")).default;
    
    // Re-import main to trigger the mount
    await import("./main.js");
    
    expect(document.getElementById).toHaveBeenCalledWith("app");
    expect(mount).toHaveBeenCalledWith(App, { target: mockElement });
  });

  it("exports the mounted app instance", async () => {
    const module = await import("./main.js");
    
    expect(module.default).toBe(mockApp);
  });

  it("handles missing #app element gracefully", async () => {
    vi.spyOn(document, "getElementById").mockReturnValue(null);
    
    const App = (await import("./App.svelte")).default;
    
    // Re-import main
    await import("./main.js");
    
    expect(mount).toHaveBeenCalledWith(App, { target: null });
  });
});