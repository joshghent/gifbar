import { describe, it, expect } from "vitest";

describe("test-setup", () => {
  it("imports @testing-library/jest-dom/vitest without errors", () => {
    expect(() => {
      require("@testing-library/jest-dom/vitest");
    }).not.toThrow();
  });

  it("provides jest-dom matchers to vitest", () => {
    const element = document.createElement("div");
    element.textContent = "Hello World";
    document.body.appendChild(element);

    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent("Hello World");

    document.body.removeChild(element);
  });

  it("provides toHaveAttribute matcher", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "text");
    element.setAttribute("placeholder", "Enter text");

    expect(element).toHaveAttribute("type", "text");
    expect(element).toHaveAttribute("placeholder", "Enter text");
  });

  it("provides toHaveClass matcher", () => {
    const element = document.createElement("div");
    element.className = "test-class another-class";

    expect(element).toHaveClass("test-class");
    expect(element).toHaveClass("another-class");
    expect(element).toHaveClass("test-class", "another-class");
  });

  it("provides toBeVisible matcher", () => {
    const element = document.createElement("div");
    element.textContent = "Visible";
    document.body.appendChild(element);

    expect(element).toBeVisible();

    element.style.display = "none";
    expect(element).not.toBeVisible();

    document.body.removeChild(element);
  });

  it("provides toBeDisabled matcher", () => {
    const button = document.createElement("button");
    expect(button).not.toBeDisabled();

    button.disabled = true;
    expect(button).toBeDisabled();
  });

  it("provides toHaveValue matcher", () => {
    const input = document.createElement("input");
    input.value = "test value";

    expect(input).toHaveValue("test value");
  });
});