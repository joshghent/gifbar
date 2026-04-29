import { describe, it, expect } from "vitest";

describe("test-setup", () => {
  it("imports jest-dom matchers for vitest", () => {
    // Verify that jest-dom matchers are available
    expect(expect.toBeInTheDocument).toBeDefined();
    expect(expect.toHaveAttribute).toBeDefined();
    expect(expect.toHaveClass).toBeDefined();
    expect(expect.toHaveTextContent).toBeDefined();
  });

  it("provides custom matchers through expect", () => {
    const element = document.createElement("div");
    element.textContent = "Hello";
    document.body.appendChild(element);

    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent("Hello");

    document.body.removeChild(element);
  });

  it("allows checking for element attributes", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "text");
    element.setAttribute("placeholder", "Enter text");

    expect(element).toHaveAttribute("type", "text");
    expect(element).toHaveAttribute("placeholder", "Enter text");
  });

  it("allows checking for CSS classes", () => {
    const element = document.createElement("div");
    element.className = "test-class another-class";

    expect(element).toHaveClass("test-class");
    expect(element).toHaveClass("another-class");
    expect(element).toHaveClass("test-class", "another-class");
  });
});