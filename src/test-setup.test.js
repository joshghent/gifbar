import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";

describe("test-setup", () => {
  it("imports jest-dom matchers for vitest", () => {
    // Verify that jest-dom matchers are available
    const element = document.createElement("div");
    element.textContent = "test";
    document.body.appendChild(element);

    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent("test");

    document.body.removeChild(element);
  });

  it("provides toBeInTheDocument matcher", () => {
    const element = document.createElement("span");
    document.body.appendChild(element);

    expect(element).toBeInTheDocument();

    document.body.removeChild(element);
    expect(element).not.toBeInTheDocument();
  });

  it("provides toHaveAttribute matcher", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "text");
    element.setAttribute("placeholder", "Enter text");

    expect(element).toHaveAttribute("type", "text");
    expect(element).toHaveAttribute("placeholder", "Enter text");
    expect(element).not.toHaveAttribute("disabled");
  });

  it("provides toHaveTextContent matcher", () => {
    const element = document.createElement("div");
    element.textContent = "Hello World";

    expect(element).toHaveTextContent("Hello World");
    expect(element).toHaveTextContent(/Hello/);
    expect(element).not.toHaveTextContent("Goodbye");
  });

  it("provides toBeVisible matcher", () => {
    const element = document.createElement("div");
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
});