import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";

describe("test-setup", () => {
  it("imports jest-dom matchers for vitest", () => {
    // Verify that jest-dom matchers are available
    const element = document.createElement("div");
    element.textContent = "test";
    document.body.appendChild(element);

    expect(element).toBeInTheDocument();
    
    document.body.removeChild(element);
  });

  it("provides toHaveAttribute matcher", () => {
    const element = document.createElement("a");
    element.setAttribute("href", "https://example.com");

    expect(element).toHaveAttribute("href", "https://example.com");
  });

  it("provides toHaveClass matcher", () => {
    const element = document.createElement("div");
    element.className = "test-class";

    expect(element).toHaveClass("test-class");
  });

  it("provides toBeVisible matcher", () => {
    const element = document.createElement("div");
    element.style.display = "block";
    document.body.appendChild(element);

    expect(element).toBeVisible();

    document.body.removeChild(element);
  });

  it("provides toHaveTextContent matcher", () => {
    const element = document.createElement("p");
    element.textContent = "Hello World";

    expect(element).toHaveTextContent("Hello World");
  });
});