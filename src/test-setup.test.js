import { describe, it, expect } from "vitest";

describe("test-setup", () => {
  it("imports jest-dom matchers for vitest", () => {
    // Verify that jest-dom matchers are available
    const element = document.createElement("div");
    element.textContent = "Hello";
    document.body.appendChild(element);

    expect(element).toBeInTheDocument();
    
    document.body.removeChild(element);
  });

  it("provides toHaveAttribute matcher", () => {
    const element = document.createElement("img");
    element.setAttribute("alt", "test image");

    expect(element).toHaveAttribute("alt", "test image");
  });

  it("provides toHaveTextContent matcher", () => {
    const element = document.createElement("p");
    element.textContent = "Test content";

    expect(element).toHaveTextContent("Test content");
  });

  it("provides toBeVisible matcher", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);

    expect(element).toBeVisible();
    
    document.body.removeChild(element);
  });

  it("provides toBeDisabled matcher", () => {
    const button = document.createElement("button");
    button.disabled = true;

    expect(button).toBeDisabled();
  });

  it("provides toHaveClass matcher", () => {
    const element = document.createElement("div");
    element.className = "test-class another-class";

    expect(element).toHaveClass("test-class");
    expect(element).toHaveClass("test-class", "another-class");
  });
});