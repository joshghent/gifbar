import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { mount } from "svelte";

// Mock the svelte mount function
vi.mock("svelte", () => ({
  mount: vi.fn(() => ({ _target: "mock-app-instance" })),
}));

// Mock the App component
vi.mock("./App.svelte", () => ({
  default: {},
}));

describe("main", () => {
  let originalGetElementById;
  let mockAppElement;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup DOM mock
    mockAppElement = document.createElement("div");
    mockAppElement.id = "app";
    document.body.appendChild(mockAppElement);
    
    originalGetElementById = document.getElementById;
    document.getElementById = vi.fn((id) => {
      if (id === "app") return mockAppElement;
      return null;
    });
  });

  afterAll(() => {
    document.getElementById = originalGetElementById;
  });

  it("mounts the App component to the #app element", async () => {
    const { default: App } = await import("./App.svelte");
    
    // Clear previous imports and re-import main to trigger mount
    vi.resetModules();
    vi.doMock("svelte", () => ({
      mount: vi.fn(() => ({ _target: "mock-app-instance" })),
    }));
    vi.doMock("./App.svelte", () => ({
      default: App,
    }));

    const { default: app } = await import("./main.js");
    const { mount: mountFn } = await import("svelte");

    expect(document.getElementById).toHaveBeenCalledWith("app");
    expect(mountFn).toHaveBeenCalledWith(App, { target: mockAppElement });
    expect(app).toBeDefined();
  });

  it("exports the app instance", async () => {
    vi.resetModules();
    vi.doMock("svelte", () => ({
      mount: vi.fn(() => ({ _target: "mock-app-instance" })),
    }));

    const { default: app } = await import("./main.js");
    
    expect(app).toEqual({ _target: "mock-app-instance" });
  });

  it("passes the correct target element to mount", async () => {
    vi.resetModules();
    const mockMount = vi.fn(() => ({ _target: "test-instance" }));
    vi.doMock("svelte", () => ({
      mount: mockMount,
    }));

    await import("./main.js");

    expect(mockMount).toHaveBeenCalledTimes(1);
    const callArgs = mockMount.mock.calls[0];
    expect(callArgs[1]).toHaveProperty("target", mockAppElement);
  });
});