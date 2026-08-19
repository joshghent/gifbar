import { describe, it, expect, vi, beforeEach } from "vitest";

beforeEach(() => {
  vi.restoreAllMocks();
});

const workerResponse = {
  gifs: [
    {
      id: "giphy-1",
      title: "Funny cat",
      preview: "https://giphy.com/small/1.gif",
      original: "https://giphy.com/original/1.gif",
      source: "giphy",
    },
    {
      id: "tenor-1",
      title: "Laughing",
      preview: "https://tenor.com/tiny/1.gif",
      original: "https://tenor.com/gif/1.gif",
      source: "tenor",
    },
  ],
};

function mockFetch(body, ok = true) {
  vi.stubGlobal(
    "fetch",
    vi.fn(() => Promise.resolve({ ok, json: () => Promise.resolve(body) })),
  );
}

describe("gif-api", () => {
  it("requests trending from the worker and returns its gifs", async () => {
    mockFetch(workerResponse);
    const { trending } = await import("./gif-api.js");

    const results = await trending(20);

    expect(fetch).toHaveBeenCalledTimes(1);
    const url = fetch.mock.calls[0][0].toString();
    expect(url).toContain("/trending");
    expect(url).toContain("limit=20");
    expect(results).toEqual(workerResponse.gifs);
  });

  it("sends the query to the worker's search endpoint", async () => {
    mockFetch(workerResponse);
    const { search } = await import("./gif-api.js");

    await search("cats");

    const url = fetch.mock.calls[0][0].toString();
    expect(url).toContain("/search");
    expect(url).toContain("q=cats");
  });

  it("falls back to trending when the query is only whitespace", async () => {
    mockFetch(workerResponse);
    const { search } = await import("./gif-api.js");

    await search("   ");

    expect(fetch.mock.calls[0][0].toString()).toContain("/trending");
  });

  it("never sends a provider API key — the worker holds those", async () => {
    mockFetch(workerResponse);
    const { search } = await import("./gif-api.js");

    await search("cats");

    const url = fetch.mock.calls[0][0].toString();
    expect(url).not.toContain("api_key");
    expect(url).not.toMatch(/[?&]key=/);
  });

  it("tolerates a worker response with no gifs field", async () => {
    mockFetch({});
    const { trending } = await import("./gif-api.js");

    expect(await trending()).toEqual([]);
  });

  it("throws when the worker returns a non-ok response", async () => {
    mockFetch({}, false);
    const { trending } = await import("./gif-api.js");

    await expect(trending()).rejects.toThrow(/GIF API responded/);
  });
});
