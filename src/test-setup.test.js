import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("test-setup", () => {
  let originalToHaveAttribute;
  let originalToBeInTheDocument;

  beforeEach(() => {
    // Store original matchers if they exist
    originalToHaveAttribute = expect.extend ? vi.fn() : null;
    originalToBeInTheDocument = expect.extend ? vi.fn() : null;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("imports @testing-library/jest-dom/vitest without errors", () => {
    expect(() => {
      require("./test-setup.js");
    }).not.toThrow();
  });

  it("extends expect with custom matchers", () => {
    // The test-setup should have already run at this point
    expect(expect).toHaveProperty("toBeInTheDocument");
    expect(expect).toHaveProperty("toHaveAttribute");
  });

  it("provides toBeInTheDocument matcher", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);

    expect(element).toBeInTheDocument();

    document.body.removeChild(element);
  });

  it("provides toHaveAttribute matcher", () => {
    const element = document.createElement("img");
    element.setAttribute("alt", "test image");

    expect(element).toHaveAttribute("alt", "test image");
  });

  it("provides toHaveLength matcher", () => {
    const array = [1, 2, 3];
    expect(array).toHaveLength(3);
  });

  it("provides toHaveBeenCalled matcher for mocks", () => {
    const mockFn = vi.fn();
    mockFn();

    expect(mockFn).toHaveBeenCalled();
  });

  it("provides toHaveBeenCalledWith matcher for mocks", () => {
    const mockFn = vi.fn();
    mockFn("test", 123);

    expect(mockFn).toHaveBeenCalledWith("test", 123);
  });
});