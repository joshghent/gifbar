import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { screen } from "@testing-library/svelte";

describe("test-setup", () => {
  let testElement;

  beforeEach(() => {
    testElement = document.createElement("div");
    document.body.appendChild(testElement);
  });

  afterEach(() => {
    document.body.removeChild(testElement);
  });

  it("extends expect with jest-dom matchers", () => {
    expect(expect.toBeInTheDocument).toBeDefined();
    expect(expect.toHaveAttribute).toBeDefined();
    expect(expect.toHaveClass).toBeDefined();
  });

  it("toBeInTheDocument matcher works correctly", () => {
    expect(testElement).toBeInTheDocument();
  });

  it("toHaveAttribute matcher works correctly", () => {
    testElement.setAttribute("data-test", "value");
    expect(testElement).toHaveAttribute("data-test", "value");
  });

  it("toHaveClass matcher works correctly", () => {
    testElement.className = "test-class";
    expect(testElement).toHaveClass("test-class");
  });

  it("toBeVisible matcher works correctly", () => {
    expect(testElement).toBeVisible();
  });

  it("toHaveTextContent matcher works correctly", () => {
    testElement.textContent = "Hello World";
    expect(testElement).toHaveTextContent("Hello World");
  });

  it("not modifier works with jest-dom matchers", () => {
    testElement.setAttribute("data-test", "value");
    expect(testElement).not.toHaveAttribute("data-other");
  });
});