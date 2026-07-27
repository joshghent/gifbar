import { describe, it, expect } from "vitest";

describe("test-setup", () => {
  it("loads without throwing errors", async () => {
    await expect(import("./test-setup.js")).resolves.toBeDefined();
  });

  it("extends expect with jest-dom matchers", () => {
    // If the jest-dom matchers are properly registered, these should exist
    expect(typeof expect(document.createElement("div")).toBeInTheDocument).toBe(
      "function"
    );
  });

  it("provides toHaveAttribute matcher from jest-dom", () => {
    const el = document.createElement("div");
    el.setAttribute("data-test", "value");
    expect(() => expect(el).toHaveAttribute("data-test", "value")).not.toThrow();
  });

  it("provides toBeInTheDocument matcher from jest-dom", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);
    expect(() => expect(el).toBeInTheDocument()).not.toThrow();
    document.body.removeChild(el);
  });

  it("correctly fails toBeInTheDocument for detached elements", () => {
    const el = document.createElement("div");
    expect(() => expect(el).toBeInTheDocument()).toThrow();
  });
});