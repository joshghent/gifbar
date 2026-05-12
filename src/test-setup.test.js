import { describe, it, expect, beforeAll } from "vitest";

describe("test-setup", () => {
  it("imports jest-dom matchers for vitest", () => {
    // Verify that jest-dom matchers are available
    expect(expect.toBeInTheDocument).toBeDefined();
    expect(expect.toHaveAttribute).toBeDefined();
    expect(expect.toHaveClass).toBeDefined();
    expect(expect.toHaveTextContent).toBeDefined();
  });

  it("enables DOM testing matchers", () => {
    // Create a mock element to test matchers work
    const element = document.createElement("div");
    element.textContent = "Test content";
    document.body.appendChild(element);

    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent("Test content");

    document.body.removeChild(element);
  });

  it("provides toHaveAttribute matcher", () => {
    const element = document.createElement("a");
    element.setAttribute("href", "https://example.com");
    
    expect(element).toHaveAttribute("href");
    expect(element).toHaveAttribute("href", "https://example.com");
  });

  it("provides toHaveClass matcher", () => {
    const element = document.createElement("div");
    element.className = "test-class another-class";
    
    expect(element).toHaveClass("test-class");
    expect(element).toHaveClass("test-class", "another-class");
  });
});