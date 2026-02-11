import { describe, it, expect, vi, beforeEach } from "vitest";

// Global fetch mock — set up before each test
beforeEach(() => {
  vi.restoreAllMocks();
});

function mockFetch(giphyData, tenorData) {
  let callIndex = 0;
  vi.stubGlobal(
    "fetch",
    vi.fn(() => {
      const data = callIndex === 0 ? giphyData : tenorData;
      callIndex++;
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(data),
      });
    }),
  );
}

const mockGiphyResponse = {
  data: [
    {
      id: "giphy-1",
      title: "Funny cat",
      images: {
        original: { url: "https://giphy.com/original/1.gif" },
        fixed_width_small: { url: "https://giphy.com/small/1.gif" },
      },
    },
    {
      id: "giphy-2",
      title: "Dancing dog",
      images: {
        original: { url: "https://giphy.com/original/2.gif" },
        fixed_width_small: { url: "https://giphy.com/small/2.gif" },
      },
    },
  ],
};

const mockTenorResponse = {
  results: [
    {
      id: "tenor-1",
      content_description: "Laughing",
      media_formats: {
        gif: { url: "https://tenor.com/gif/1.gif" },
        tinygif: { url: "https://tenor.com/tiny/1.gif" },
      },
    },
  ],
};

describe("gif-api", () => {
  describe("trending", () => {
    it("fetches from both GIPHY and Tenor and interleaves results", async () => {
      mockFetch(mockGiphyResponse, mockTenorResponse);
      const { trending } = await import("./gif-api.js");

      const results = await trending(20);

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(results.length).toBe(3);
      expect(results[0].id).toBe("giphy-1");
      expect(results[0].source).toBe("giphy");
      expect(results[1].id).toBe("tenor-1");
      expect(results[1].source).toBe("tenor");
      expect(results[2].id).toBe("giphy-2");
    });

    it("normalizes GIPHY data correctly", async () => {
      mockFetch(mockGiphyResponse, { results: [] });
      const { trending } = await import("./gif-api.js");

      const results = await trending();
      const gif = results[0];

      expect(gif).toEqual({
        id: "giphy-1",
        title: "Funny cat",
        preview: "https://giphy.com/small/1.gif",
        original: "https://giphy.com/original/1.gif",
        source: "giphy",
      });
    });

    it("normalizes Tenor data correctly", async () => {
      mockFetch({ data: [] }, mockTenorResponse);
      const { trending } = await import("./gif-api.js");

      const results = await trending();
      const gif = results[0];

      expect(gif).toEqual({
        id: "tenor-1",
        title: "Laughing",
        preview: "https://tenor.com/tiny/1.gif",
        original: "https://tenor.com/gif/1.gif",
        source: "tenor",
      });
    });
  });

  describe("search", () => {
    it("passes query parameter to both APIs", async () => {
      mockFetch(mockGiphyResponse, mockTenorResponse);
      const { search } = await import("./gif-api.js");

      await search("cats");

      const calls = fetch.mock.calls;
      expect(calls[0][0].toString()).toContain("q=cats");
      expect(calls[1][0].toString()).toContain("q=cats");
    });

    it("falls back to trending when query is empty", async () => {
      mockFetch(mockGiphyResponse, mockTenorResponse);
      const { search } = await import("./gif-api.js");

      const results = await search("  ");

      const calls = fetch.mock.calls;
      expect(calls[0][0].toString()).toContain("/trending");
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe("error handling", () => {
    it("returns empty array when fetch fails", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn(() => Promise.reject(new Error("Network error"))),
      );
      const { trending } = await import("./gif-api.js");

      const results = await trending();
      expect(results).toEqual([]);
    });

    it("returns empty array when API returns non-ok response", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn(() => Promise.resolve({ ok: false })),
      );
      const { trending } = await import("./gif-api.js");

      const results = await trending();
      expect(results).toEqual([]);
    });
  });
});
