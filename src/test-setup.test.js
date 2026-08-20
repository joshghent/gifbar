import { describe, it, expect } from "vitest";

describe("test-setup", () => {
  it("loads without throwing", async () => {
    await expect(import("./test-setup.js")).resolves.toBeDefined();
  });

  it("extends expect with jest-dom matchers", () => {
    const div = document.createElement("div");
    div.textContent = "Hello world";
    document.body.appendChild(div);

    expect(div).toBeInTheDocument();
    expect(div).toHaveTextContent("Hello world");

    document.body.removeChild(div);
  });

  it("provides toBeVisible matcher from jest-dom", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);

    expect(div).toBeVisible();

    document.body.removeChild(div);
  });

  it("provides toHaveAttribute matcher from jest-dom", () => {
    const button = document.createElement("button");
    button.setAttribute("disabled", "");
    document.body.appendChild(button);

    expect(button).toHaveAttribute("disabled");
    expect(button).toBeDisabled();

    document.body.removeChild(button);
  });
});