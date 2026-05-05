import { describe, it, expect, beforeAll } from "vitest";
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

  it("provides toBeVisible matcher", () => {
    const element = document.createElement("div");
    element.style.display = "block";
    document.body.appendChild(element);

    expect(element).toBeVisible();

    element.style.display = "none";
    expect(element).not.toBeVisible();

    document.body.removeChild(element);
  });

  it("provides toHaveAttribute matcher", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "text");
    element.setAttribute("disabled", "");

    expect(element).toHaveAttribute("type", "text");
    expect(element).toHaveAttribute("disabled");
  });

  it("provides toHaveClass matcher", () => {
    const element = document.createElement("div");
    element.className = "btn btn-primary";

    expect(element).toHaveClass("btn");
    expect(element).toHaveClass("btn-primary");
    expect(element).not.toHaveClass("btn-secondary");
  });

  it("provides toHaveStyle matcher", () => {
    const element = document.createElement("div");
    element.style.color = "red";
    element.style.display = "flex";

    expect(element).toHaveStyle({ color: "red" });
    expect(element).toHaveStyle("display: flex");
  });

  it("provides toBeDisabled matcher", () => {
    const button = document.createElement("button");
    button.disabled = true;

    expect(button).toBeDisabled();

    button.disabled = false;
    expect(button).not.toBeDisabled();
  });

  it("provides toBeEnabled matcher", () => {
    const button = document.createElement("button");
    button.disabled = false;

    expect(button).toBeEnabled();

    button.disabled = true;
    expect(button).not.toBeEnabled();
  });

  it("provides toHaveValue matcher", () => {
    const input = document.createElement("input");
    input.value = "test value";

    expect(input).toHaveValue("test value");
    expect(input).not.toHaveValue("other value");
  });

  it("provides toBeEmptyDOMElement matcher", () => {
    const element = document.createElement("div");

    expect(element).toBeEmptyDOMElement();

    element.appendChild(document.createElement("span"));
    expect(element).not.toBeEmptyDOMElement();
  });

  it("provides toContainElement matcher", () => {
    const parent = document.createElement("div");
    const child = document.createElement("span");
    parent.appendChild(child);

    expect(parent).toContainElement(child);
  });

  it("provides toContainHTML matcher", () => {
    const element = document.createElement("div");
    element.innerHTML = "<span>Hello</span>";

    expect(element).toContainHTML("<span>Hello</span>");
    expect(element).not.toContainHTML("<p>Goodbye</p>");
  });
});