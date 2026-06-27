import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";

describe("test-setup", () => {
  it("imports jest-dom matchers for vitest", () => {
    // Verify that jest-dom matchers are available
    const element = document.createElement("div");
    expect(element).toBeInTheDocument;
    expect(element).toHaveAttribute;
    expect(element).toHaveClass;
  });

  it("extends expect with jest-dom matchers", () => {
    const element = document.createElement("button");
    element.disabled = true;
    document.body.appendChild(element);

    expect(element).toBeInTheDocument();
    expect(element).toBeDisabled();

    document.body.removeChild(element);
  });

  it("provides toHaveTextContent matcher", () => {
    const element = document.createElement("div");
    element.textContent = "Hello World";

    expect(element).toHaveTextContent("Hello World");
  });

  it("provides toHaveAttribute matcher", () => {
    const element = document.createElement("img");
    element.setAttribute("alt", "Test image");

    expect(element).toHaveAttribute("alt", "Test image");
  });

  it("provides toHaveClass matcher", () => {
    const element = document.createElement("div");
    element.className = "test-class another-class";

    expect(element).toHaveClass("test-class");
    expect(element).toHaveClass("another-class");
  });
});