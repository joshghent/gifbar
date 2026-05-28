import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";

describe("test-setup", () => {
  it("imports jest-dom matchers for vitest", () => {
    // Verify that jest-dom matchers are available
    const element = document.createElement("div");
    element.textContent = "Test content";
    document.body.appendChild(element);

    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent("Test content");

    document.body.removeChild(element);
  });

  it("provides toHaveAttribute matcher", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "text");
    element.setAttribute("placeholder", "Enter text");

    expect(element).toHaveAttribute("type", "text");
    expect(element).toHaveAttribute("placeholder", "Enter text");
  });

  it("provides toBeVisible matcher", () => {
    const element = document.createElement("div");
    element.style.display = "block";
    document.body.appendChild(element);

    expect(element).toBeVisible();

    element.style.display = "none";
    expect(element).not.toBeVisible();

    document.body.removeChild(element);
  });

  it("provides toHaveClass matcher", () => {
    const element = document.createElement("div");
    element.className = "test-class another-class";

    expect(element).toHaveClass("test-class");
    expect(element).toHaveClass("another-class");
    expect(element).not.toHaveClass("missing-class");
  });

  it("provides toBeDisabled matcher", () => {
    const button = document.createElement("button");
    
    expect(button).not.toBeDisabled();
    
    button.disabled = true;
    expect(button).toBeDisabled();
  });
});