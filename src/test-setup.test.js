import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("test-setup", () => {
  let originalMatchers;

  beforeEach(() => {
    // Store original matchers
    originalMatchers = expect.extend ? { ...expect } : null;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("imports @testing-library/jest-dom/vitest without errors", () => {
    expect(() => {
      require("./test-setup");
    }).not.toThrow();
  });

  it("extends vitest expect with jest-dom matchers", () => {
    // After importing test-setup, these matchers should be available
    expect(expect.toBeInTheDocument).toBeDefined();
    expect(expect.toHaveAttribute).toBeDefined();
    expect(expect.toHaveTextContent).toBeDefined();
  });

  it("provides toBeInTheDocument matcher", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);

    expect(element).toBeInTheDocument();

    document.body.removeChild(element);
  });

  it("provides toHaveAttribute matcher", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "text");

    expect(element).toHaveAttribute("type", "text");
  });

  it("provides toHaveTextContent matcher", () => {
    const element = document.createElement("div");
    element.textContent = "Hello World";

    expect(element).toHaveTextContent("Hello World");
  });

  it("provides toBeVisible matcher", () => {
    const element = document.createElement("div");
    element.style.display = "block";
    document.body.appendChild(element);

    expect(element).toBeVisible();

    document.body.removeChild(element);
  });

  it("provides toBeDisabled matcher", () => {
    const button = document.createElement("button");
    button.disabled = true;

    expect(button).toBeDisabled();
  });

  it("provides toBeEnabled matcher", () => {
    const button = document.createElement("button");
    button.disabled = false;

    expect(button).toBeEnabled();
  });

  it("provides toHaveClass matcher", () => {
    const element = document.createElement("div");
    element.className = "test-class";

    expect(element).toHaveClass("test-class");
  });

  it("provides toHaveValue matcher", () => {
    const input = document.createElement("input");
    input.value = "test value";

    expect(input).toHaveValue("test value");
  });
});