import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { mount } from "svelte";

// Mock the App component
vi.mock("./App.svelte", () => ({
  default: {},
}));

// Mock the svelte mount function
vi.mock("svelte", () => ({
  mount: vi.fn(() => ({ $destroy: vi.fn() })),
}));

describe("main.js", () => {
  let originalGetElementById;

  beforeEach(() => {
    vi.clearAllMocks();
    originalGetElementById = document.getElementById;
    document.getElementById = vi.fn((id) => {
      if (id === "app") {
        return document.createElement("div");
      }
      return null;
    });
  });

  afterAll(() => {
    document.getElementById = originalGetElementById;
  });

  it("mounts the App component to the target element", async () => {
    const mockElement = document.createElement("div");
    document.getElementById = vi.fn(() => mockElement);

    // Re-import to trigger mount
    await import("./main.js");

    expect(document.getElementById).toHaveBeenCalledWith("app");
    expect(mount).toHaveBeenCalled();
  });

  it("passes the correct target to mount", async () => {
    const mockElement = document.createElement("div");
    mockElement.id = "app";
    document.getElementById = vi.fn(() => mockElement);

    await import("./main.js");

    const mountCalls = mount.mock.calls;
    const lastCall = mountCalls[mountCalls.length - 1];
    expect(lastCall[1]).toEqual({ target: mockElement });
  });

  it("exports the mounted app instance", async () => {
    const mockApp = { $destroy: vi.fn() };
    mount.mockReturnValue(mockApp);

    const module = await import("./main.js");

    expect(module.default).toBe(mockApp);
  });
});