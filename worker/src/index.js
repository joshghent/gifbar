import { Hono } from "hono";
import { cors } from "hono/cors";

const GIPHY_BASE = "https://api.giphy.com/v1/gifs";
const TENOR_BASE = "https://tenor.googleapis.com/v2";

// How long an upstream response stays in the Cloudflare edge cache. GIF
// trending and search results are not time-critical, and caching is what
// keeps the shared upstream keys inside the free tier.
const CACHE_SECONDS = 300;

const app = new Hono();

app.use("/*", cors({ origin: "*", allowMethods: ["GET"] }));

function normalizeGiphy(gif) {
  return {
    id: `giphy-${gif.id}`,
    title: gif.title || "",
    preview: gif.images?.fixed_width_small?.url ?? "",
    original: gif.images?.original?.url ?? "",
    source: "giphy",
  };
}

function normalizeTenor(gif) {
  const preview =
    gif.media_formats?.tinygif?.url || gif.media_formats?.gif?.url || "";
  return {
    id: `tenor-${gif.id}`,
    title: gif.content_description || "",
    preview,
    original: gif.media_formats?.gif?.url || preview,
    source: "tenor",
  };
}

async function fetchJson(url) {
  const res = await fetch(url, { cf: { cacheTtl: CACHE_SECONDS } });
  if (!res.ok) {
    throw new Error(`${new URL(url).host} responded ${res.status}`);
  }
  return res.json();
}

async function fromGiphy(env, endpoint, params) {
  if (!env.GIPHY_API_KEY) return [];
  const url = new URL(`${GIPHY_BASE}/${endpoint}`);
  url.searchParams.set("api_key", env.GIPHY_API_KEY);
  url.searchParams.set("rating", "g");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const json = await fetchJson(url.toString());
  return (json.data || []).map(normalizeGiphy);
}

async function fromTenor(env, endpoint, params) {
  if (!env.TENOR_API_KEY) return [];
  const url = new URL(`${TENOR_BASE}/${endpoint}`);
  url.searchParams.set("key", env.TENOR_API_KEY);
  url.searchParams.set("content_filter", "medium");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const json = await fetchJson(url.toString());
  return (json.results || []).map(normalizeTenor);
}

function interleave(a, b) {
  const out = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (i < a.length) out.push(a[i]);
    if (i < b.length) out.push(b[i]);
  }
  return out;
}

function clampLimit(raw) {
  const n = Number.parseInt(raw ?? "20", 10);
  if (Number.isNaN(n)) return 20;
  return Math.min(Math.max(n, 1), 50);
}

// One provider being down or rate-limited should degrade the grid, not empty
// it — so settle both and keep whichever succeeded.
async function gather(tasks) {
  const settled = await Promise.allSettled(tasks);
  const [giphy, tenor] = settled.map((r) =>
    r.status === "fulfilled" ? r.value : [],
  );
  if (settled.every((r) => r.status === "rejected")) {
    throw settled[0].reason;
  }
  return interleave(giphy, tenor);
}

function withCache(c, body) {
  c.header("Cache-Control", `public, max-age=${CACHE_SECONDS}`);
  return c.json(body);
}

app.get("/health", (c) => c.json({ ok: true }));

app.get("/trending", async (c) => {
  const limit = clampLimit(c.req.query("limit"));
  const half = Math.ceil(limit / 2);
  const gifs = await gather([
    fromGiphy(c.env, "trending", { limit: half }),
    fromTenor(c.env, "featured", { limit: half }),
  ]);
  return withCache(c, { gifs });
});

app.get("/search", async (c) => {
  const q = (c.req.query("q") || "").trim();
  const limit = clampLimit(c.req.query("limit"));
  const half = Math.ceil(limit / 2);
  if (!q) {
    const gifs = await gather([
      fromGiphy(c.env, "trending", { limit: half }),
      fromTenor(c.env, "featured", { limit: half }),
    ]);
    return withCache(c, { gifs });
  }
  const gifs = await gather([
    fromGiphy(c.env, "search", { q, limit: half }),
    fromTenor(c.env, "search", { q, limit: half }),
  ]);
  return withCache(c, { gifs });
});

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "upstream request failed" }, 502);
});

export default app;
