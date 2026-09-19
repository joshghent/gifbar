import { describe, it, expect } from "vitest";

describe("test-setup", () => {
  it("imports without throwing", async () => {
    await expect(import("./test-setup.js")).resolves.toBeDefined();
  });

  it("extends expect with jest-dom matchers", () => {
    document.body.innerHTML = "<div id='el'>Hello</div>";
    const el = document.getElementById("el");

    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent("Hello");
  });

  it("provides toBeVisible matcher from jest-dom", () => {
    document.body.innerHTML = "<div id='visible'>Visible</div>";
    const el = document.getElementById("visible");

    expect(el).toBeVisible();
  });

  it("provides toHaveAttribute matcher from jest-dom", () => {
    document.body.innerHTML = "<button id='btn' disabled>Click</button>";
    const el = document.getElementById("btn");

    expect(el).toHaveAttribute("disabled");
  });

  it("correctly fails toBeInTheDocument for detached elements", () => {
    const detached = document.createElement("div");

    expect(detached).not.toBeInTheDocument();
  });
});