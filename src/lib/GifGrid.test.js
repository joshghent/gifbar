import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/svelte";
import { invoke } from "@tauri-apps/api/core";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import GifGrid from "./GifGrid.svelte";

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(() => Promise.resolve()),
}));

vi.mock("@tauri-apps/plugin-clipboard-manager", () => ({
  writeText: vi.fn(() => Promise.resolve()),
}));

beforeEach(() => {
  vi.clearAllMocks();
  invoke.mockResolvedValue(undefined);
});

const mockGifs = [
  {
    id: "gif-1",
    title: "Funny cat",
    preview: "https://example.com/preview/1.gif",
    original: "https://example.com/original/1.gif",
    source: "giphy",
  },
  {
    id: "gif-2",
    title: "Dancing dog",
    preview: "https://example.com/preview/2.gif",
    original: "https://example.com/original/2.gif",
    source: "tenor",
  },
];

describe("GifGrid", () => {
  it("renders all GIFs as images", () => {
    const { getAllByRole } = render(GifGrid, {
      props: { gifs: mockGifs, copiedId: null, oncopied: vi.fn() },
    });

    const images = getAllByRole("img");
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute("alt", "Funny cat");
    expect(images[1]).toHaveAttribute("alt", "Dancing dog");
  });

  it("calls oncopied when a GIF is clicked", async () => {
    const oncopied = vi.fn();
    const { getAllByRole } = render(GifGrid, {
      props: { gifs: mockGifs, copiedId: null, oncopied },
    });

    const buttons = getAllByRole("button");
    await fireEvent.click(buttons[0]);

    // Give the async copyGif function time to resolve
    await vi.waitFor(() => {
      expect(oncopied).toHaveBeenCalledWith("gif-1");
    });
  });

  it("copies the image itself, not the link", async () => {
    const { getAllByRole } = render(GifGrid, {
      props: { gifs: mockGifs, copiedId: null, oncopied: vi.fn() },
    });

    await fireEvent.click(getAllByRole("button")[0]);

    await vi.waitFor(() => {
      expect(invoke).toHaveBeenCalledWith("copy_gif", {
        url: "https://example.com/original/1.gif",
        id: "gif-1",
      });
    });
    expect(writeText).not.toHaveBeenCalled();
  });

  it("falls back to copying the URL when the image copy fails", async () => {
    invoke.mockRejectedValueOnce(new Error("no pasteboard"));
    const oncopied = vi.fn();
    const { getAllByRole } = render(GifGrid, {
      props: { gifs: mockGifs, copiedId: null, oncopied },
    });

    await fireEvent.click(getAllByRole("button")[0]);

    await vi.waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(
        "https://example.com/original/1.gif",
      );
    });
    // The user still gets the "Copied!" confirmation — something did land.
    expect(oncopied).toHaveBeenCalledWith("gif-1");
  });

  it("shows 'Copied!' overlay for the copied GIF", () => {
    const { getByText } = render(GifGrid, {
      props: { gifs: mockGifs, copiedId: "gif-1", oncopied: vi.fn() },
    });

    expect(getByText("Copied!")).toBeInTheDocument();
  });

  it("renders empty grid when no GIFs provided", () => {
    const { queryAllByRole } = render(GifGrid, {
      props: { gifs: [], copiedId: null, oncopied: vi.fn() },
    });

    expect(queryAllByRole("button")).toHaveLength(0);
  });
});
