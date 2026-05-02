import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";

describe("test-setup", () => {
  it("loads jest-dom matchers", () => {
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
    element.setAttribute("placeholder", "Test");

    expect(element).toHaveAttribute("type", "text");
    expect(element).toHaveAttribute("placeholder", "Test");
  });

  it("provides toHaveClass matcher", () => {
    const element = document.createElement("div");
    element.className = "container active";

    expect(element).toHaveClass("container");
    expect(element).toHaveClass("active");
    expect(element).toHaveClass("container", "active");
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