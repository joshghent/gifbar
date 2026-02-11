const GIPHY_KEY = import.meta.env.VITE_GIPHY_API_KEY;
const TENOR_KEY = import.meta.env.VITE_TENOR_API_KEY;

const GIPHY_BASE = "https://api.giphy.com/v1/gifs";
const TENOR_BASE = "https://tenor.googleapis.com/v2";

function normalizeGiphy(gif) {
  return {
    id: gif.id,
    title: gif.title || "",
    preview: gif.images.fixed_width_small.url,
    original: gif.images.original.url,
    source: "giphy",
  };
}

function normalizeTenor(gif) {
  const preview =
    gif.media_formats?.tinygif?.url || gif.media_formats?.gif?.url || "";
  const original = gif.media_formats?.gif?.url || preview;
  return {
    id: gif.id,
    title: gif.content_description || "",
    preview,
    original,
    source: "tenor",
  };
}

async function fetchGiphy(endpoint, params = {}) {
  if (!GIPHY_KEY) return [];
  const url = new URL(`${GIPHY_BASE}/${endpoint}`);
  url.searchParams.set("api_key", GIPHY_KEY);
  url.searchParams.set("rating", "g");
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data || []).map(normalizeGiphy);
  } catch {
    return [];
  }
}

async function fetchTenor(endpoint, params = {}) {
  if (!TENOR_KEY) return [];
  const url = new URL(`${TENOR_BASE}/${endpoint}`);
  url.searchParams.set("key", TENOR_KEY);
  url.searchParams.set("content_filter", "medium");
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const json = await res.json();
    return (json.results || []).map(normalizeTenor);
  } catch {
    return [];
  }
}

function interleave(a, b) {
  const result = [];
  const max = Math.max(a.length, b.length);
  for (let i = 0; i < max; i++) {
    if (i < a.length) result.push(a[i]);
    if (i < b.length) result.push(b[i]);
  }
  return result;
}

export async function trending(limit = 20) {
  const half = Math.ceil(limit / 2);
  const [giphy, tenor] = await Promise.all([
    fetchGiphy("trending", { limit: half }),
    fetchTenor("featured", { limit: half }),
  ]);
  return interleave(giphy, tenor);
}

export async function search(query, limit = 20) {
  if (!query.trim()) return trending(limit);
  const half = Math.ceil(limit / 2);
  const [giphy, tenor] = await Promise.all([
    fetchGiphy("search", { q: query, limit: half }),
    fetchTenor("search", { q: query, limit: half }),
  ]);
  return interleave(giphy, tenor);
}
