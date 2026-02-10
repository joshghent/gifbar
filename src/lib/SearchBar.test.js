import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/svelte";
import SearchBar from "./SearchBar.svelte";

describe("SearchBar", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders an input field", () => {
    const { getByPlaceholderText } = render(SearchBar, {
      props: { onsearch: vi.fn() },
    });

    expect(getByPlaceholderText("Search for GIFs...")).toBeInTheDocument();
  });

  it("calls onsearch after debounce on input", async () => {
    const onsearch = vi.fn();
    const { getByPlaceholderText } = render(SearchBar, {
      props: { onsearch },
    });

    const input = getByPlaceholderText("Search for GIFs...");
    await fireEvent.input(input, { target: { value: "cats" } });

    // Should not be called immediately
    expect(onsearch).not.toHaveBeenCalled();

    // Advance past debounce
    vi.advanceTimersByTime(600);
    expect(onsearch).toHaveBeenCalledWith("cats");
  });

  it("calls onsearch immediately on Enter key", async () => {
    const onsearch = vi.fn();
    const { getByPlaceholderText } = render(SearchBar, {
      props: { onsearch },
    });

    const input = getByPlaceholderText("Search for GIFs...");
    await fireEvent.input(input, { target: { value: "dogs" } });
    await fireEvent.keyDown(input, { key: "Enter" });

    expect(onsearch).toHaveBeenCalledWith("dogs");
  });
});
