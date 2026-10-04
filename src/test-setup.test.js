import { describe, it, expect } from "vitest";

describe("test-setup", () => {
  it("imports without throwing", async () => {
    await expect(import("./test-setup.js")).resolves.toBeDefined();
  });

  it("extends expect with jest-dom matchers", () => {
    // If the setup file has run (as configured in vitest setupFiles),
    // custom jest-dom matchers should be available on expect.
    expect(typeof expect.extend).toBe("function");
    expect(typeof expect(document.createElement("div")).toBeInTheDocument).toBe(
      "function",
    );
  });

  it("provides toBeInTheDocument matcher that works against the DOM", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    expect(el).toBeInTheDocument();

    document.body.removeChild(el);
    expect(el).not.toBeInTheDocument();
  });

  it("provides other jest-dom matchers such as toHaveAttribute", () => {
    const el = document.createElement("img");
    el.setAttribute("alt", "test image");

    expect(el).toHaveAttribute("alt", "test image");
    expect(el).not.toHaveAttribute("src");
  });

  it("provides toHaveTextContent matcher", () => {
    const el = document.createElement("p");
    el.textContent = "Hello world";

    expect(el).toHaveTextContent("Hello world");
    expect(el).not.toHaveTextContent("Goodbye");
  });
});