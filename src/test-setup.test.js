import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("test-setup", () => {
  let originalMatchers;

  beforeEach(() => {
    // Store original matchers state
    originalMatchers = { ...expect };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("imports jest-dom matchers without error", () => {
    expect(() => {
      require("./test-setup");
    }).not.toThrow();
  });

  it("extends expect with jest-dom matchers", () => {
    // Test that common jest-dom matchers are available
    expect(expect.toBeInTheDocument).toBeDefined();
    expect(expect.toHaveAttribute).toBeDefined();
    expect(expect.toHaveClass).toBeDefined();
    expect(expect.toHaveTextContent).toBeDefined();
  });

  it("provides toBeInTheDocument matcher", () => {
    const mockElement = document.createElement("div");
    document.body.appendChild(mockElement);

    expect(mockElement).toBeInTheDocument();

    document.body.removeChild(mockElement);
  });

  it("provides toHaveAttribute matcher", () => {
    const mockElement = document.createElement("div");
    mockElement.setAttribute("data-test", "value");

    expect(mockElement).toHaveAttribute("data-test");
    expect(mockElement).toHaveAttribute("data-test", "value");
  });

  it("provides toHaveClass matcher", () => {
    const mockElement = document.createElement("div");
    mockElement.className = "test-class";

    expect(mockElement).toHaveClass("test-class");
  });

  it("provides toHaveTextContent matcher", () => {
    const mockElement = document.createElement("div");
    mockElement.textContent = "Hello World";

    expect(mockElement).toHaveTextContent("Hello World");
    expect(mockElement).toHaveTextContent(/Hello/);
  });

  it("provides toBeVisible matcher", () => {
    const mockElement = document.createElement("div");
    mockElement.style.display = "block";
    document.body.appendChild(mockElement);

    expect(mockElement).toBeVisible();

    document.body.removeChild(mockElement);
  });

  it("provides toBeDisabled matcher", () => {
    const mockButton = document.createElement("button");
    mockButton.disabled = true;

    expect(mockButton).toBeDisabled();
  });

  it("provides toBeEnabled matcher", () => {
    const mockButton = document.createElement("button");
    mockButton.disabled = false;

    expect(mockButton).toBeEnabled();
  });

  it("provides toHaveValue matcher", () => {
    const mockInput = document.createElement("input");
    mockInput.value = "test value";

    expect(mockInput).toHaveValue("test value");
  });
});