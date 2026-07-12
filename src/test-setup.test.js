import { describe, it, expect } from "vitest";

describe("test-setup", () => {
  it("imports without throwing errors", async () => {
    await expect(import("./test-setup.js")).resolves.toBeDefined();
  });

  it("extends expect with jest-dom matchers", () => {
    // toBeInTheDocument is provided by @testing-library/jest-dom/vitest
    expect(typeof expect(document.body).toBeInTheDocument).toBe("function");
  });

  it("provides toHaveAttribute matcher", () => {
    const div = document.createElement("div");
    div.setAttribute("data-test", "value");
    expect(div).toHaveAttribute("data-test", "value");
  });

  it("provides toHaveTextContent matcher", () => {
    const div = document.createElement("div");
    div.textContent = "Hello World";
    expect(div).toHaveTextContent("Hello World");
  });

  it("provides toBeVisible matcher", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    expect(div).toBeVisible();
    document.body.removeChild(div);
  });

  it("provides toBeDisabled matcher", () => {
    const button = document.createElement("button");
    button.disabled = true;
    expect(button).toBeDisabled();
  });

  it("correctly negates matchers with .not", () => {
    const div = document.createElement("div");
    expect(div).not.toHaveAttribute("data-missing");
  });
});