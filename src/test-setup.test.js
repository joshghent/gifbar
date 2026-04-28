import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { matchers } from "@testing-library/jest-dom/vitest";

describe("test-setup", () => {
  let originalExpectExtend;

  beforeEach(() => {
    // Store the original expect.extend if it exists
    originalExpectExtend = expect.extend;
  });

  afterEach(() => {
    // Restore the original expect.extend
    if (originalExpectExtend) {
      expect.extend = originalExpectExtend;
    }
  });

  it("imports @testing-library/jest-dom/vitest without errors", () => {
    expect(() => {
      require("./test-setup.js");
    }).not.toThrow();
  });

  it("extends vitest expect with jest-dom matchers", () => {
    // Import the setup file
    require("./test-setup.js");

    // Verify that common jest-dom matchers are available
    expect(expect.toBeInTheDocument).toBeDefined();
    expect(expect.toHaveAttribute).toBeDefined();
    expect(expect.toHaveClass).toBeDefined();
  });

  it("makes toBeInTheDocument matcher available", () => {
    require("./test-setup.js");

    const element = document.createElement("div");
    document.body.appendChild(element);

    expect(element).toBeInTheDocument();

    document.body.removeChild(element);
  });

  it("makes toHaveAttribute matcher available", () => {
    require("./test-setup.js");

    const element = document.createElement("div");
    element.setAttribute("data-testid", "test");

    expect(element).toHaveAttribute("data-testid", "test");
  });

  it("makes toHaveClass matcher available", () => {
    require("./test-setup.js");

    const element = document.createElement("div");
    element.className = "test-class";

    expect(element).toHaveClass("test-class");
  });

  it("makes toHaveTextContent matcher available", () => {
    require("./test-setup.js");

    const element = document.createElement("div");
    element.textContent = "Hello World";

    expect(element).toHaveTextContent("Hello World");
  });

  it("makes toBeVisible matcher available", () => {
    require("./test-setup.js");

    const element = document.createElement("div");
    document.body.appendChild(element);

    expect(element).toBeVisible();

    document.body.removeChild(element);
  });
});