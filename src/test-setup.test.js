import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";

describe("test-setup", () => {
  it("extends vitest matchers with jest-dom", () => {
    // Create a simple DOM element to test jest-dom matchers are available
    const div = document.createElement("div");
    div.textContent = "Hello World";
    document.body.appendChild(div);

    // Test that jest-dom matchers are available
    expect(div).toBeInTheDocument();
    expect(div).toHaveTextContent("Hello World");

    // Cleanup
    document.body.removeChild(div);
  });

  it("provides toBeVisible matcher", () => {
    const div = document.createElement("div");
    div.style.display = "block";
    document.body.appendChild(div);

    expect(div).toBeVisible();

    div.style.display = "none";
    expect(div).not.toBeVisible();

    document.body.removeChild(div);
  });

  it("provides toHaveAttribute matcher", () => {
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "Enter text");

    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("placeholder", "Enter text");
    expect(input).not.toHaveAttribute("disabled");
  });

  it("provides toHaveClass matcher", () => {
    const div = document.createElement("div");
    div.className = "container active";

    expect(div).toHaveClass("container");
    expect(div).toHaveClass("active");
    expect(div).not.toHaveClass("hidden");
  });

  it("provides toBeDisabled and toBeEnabled matchers", () => {
    const button = document.createElement("button");

    expect(button).toBeEnabled();
    expect(button).not.toBeDisabled();

    button.disabled = true;

    expect(button).toBeDisabled();
    expect(button).not.toBeEnabled();
  });
});