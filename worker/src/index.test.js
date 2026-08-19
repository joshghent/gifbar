import { describe, it, expect, vi, beforeEach } from "vitest";
import app from "./index.js";

const env = { GIPHY_API_KEY: "giphy-test-key", TENOR_API_KEY: "tenor-test-key" };

const giphyBody = {
  data: [
    {
      id: "1",
      title: "Funny cat",
      images: {
        original: { url: "https://media.giphy.com/original/1.gif" },
        fixed_width_small: { url: "https://media.giphy.com/small/1.gif" },
      },
    },
  ],
};

const tenorBody = {
  results: [
    {
      id: "9",
      content_description: "Laughing",
      media_formats: {
        gif: { url: "https://media.tenor.com/9.gif" },
        tinygif: { url: "https://media.tenor.com/tiny-9.gif" },
      },
    },
  ],
};

function routeFetch(handler) {
  vi.stubGlobal(
    "fetch",
    vi.fn((url) => {
      const href = url.toString();
      const result = handler(href);
      if (result instanceof Response) return Promise.resolve(result);
      return Promise.resolve(
        new Response(JSON.stringify(result), {
          headers: { "content-type": "application/json" },
        }),
      );
    }),
  );
}

function bothProvidersOk() {
  routeFetch((href) => (href.includes("giphy") ? giphyBody : tenorBody));
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("gif proxy worker", () => {
  it("normalizes and interleaves both providers", async () => {
    bothProvidersOk();

    const res = await app.request("/trending?limit=4", {}, env);
    const { gifs } = await res.json();

    expect(res.status).toBe(200);
    expect(gifs).toEqual([
      {
        id: "giphy-1",
        title: "Funny cat",
        preview: "https://media.giphy.com/small/1.gif",
        original: "https://media.giphy.com/original/1.gif",
        source: "giphy",
      },
      {
        id: "tenor-9",
        title: "Laughing",
        preview: "https://media.tenor.com/tiny-9.gif",
        original: "https://media.tenor.com/9.gif",
        source: "tenor",
      },
    ]);
  });

  it("sends each provider its own key and never leaks one to the client", async () => {
    bothProvidersOk();

    const res = await app.request("/search?q=cats", {}, env);
    const body = await res.text();

    const urls = fetch.mock.calls.map((c) => c[0].toString());
    expect(urls.find((u) => u.includes("giphy"))).toContain(
      "api_key=giphy-test-key",
    );
    expect(urls.find((u) => u.includes("tenor"))).toContain(
      "key=tenor-test-key",
    );
    expect(body).not.toContain("giphy-test-key");
    expect(body).not.toContain("tenor-test-key");
  });

  it("still returns results when one provider fails", async () => {
    routeFetch((href) =>
      href.includes("giphy") ? new Response("nope", { status: 429 }) : tenorBody,
    );

    const res = await app.request("/trending", {}, env);
    const { gifs } = await res.json();

    expect(res.status).toBe(200);
    expect(gifs).toHaveLength(1);
    expect(gifs[0].source).toBe("tenor");
  });

  it("returns 502 when both providers fail", async () => {
    routeFetch(() => new Response("nope", { status: 500 }));

    const res = await app.request("/trending", {}, env);

    expect(res.status).toBe(502);
    expect((await res.json()).error).toBe("upstream request failed");
  });

  it("clamps limit so a caller cannot ask for an unbounded page", async () => {
    bothProvidersOk();

    await app.request("/trending?limit=9999", {}, env);

    for (const [url] of fetch.mock.calls) {
      expect(url.toString()).toContain("limit=25");
    }
  });

  it("treats a blank query as trending", async () => {
    bothProvidersOk();

    await app.request("/search?q=%20%20", {}, env);

    const urls = fetch.mock.calls.map((c) => c[0].toString());
    expect(urls.some((u) => u.includes("/trending"))).toBe(true);
    expect(urls.some((u) => u.includes("featured"))).toBe(true);
  });

  it("skips a provider whose key is not configured", async () => {
    bothProvidersOk();

    const res = await app.request(
      "/trending",
      {},
      { TENOR_API_KEY: "tenor-test-key" },
    );
    const { gifs } = await res.json();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(gifs.every((g) => g.source === "tenor")).toBe(true);
  });
});
