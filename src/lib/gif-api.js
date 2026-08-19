// GIF search goes through a Cloudflare Worker rather than straight to GIPHY
// and Tenor. Vite inlines env vars at build time, so calling the providers
// directly meant shipping their API keys inside every .app and .exe, where
// `strings` recovers them in seconds. The Worker holds the keys as secrets,
// normalizes both providers, and caches at the edge. See worker/.
const API_BASE = (
  import.meta.env.VITE_GIF_API_BASE || "https://gifbar-api.joshghent.workers.dev"
).replace(/\/$/, "");

async function fetchGifs(path, params) {
  const url = new URL(`${API_BASE}${path}`);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`GIF API responded ${res.status}`);
  }
  const json = await res.json();
  return json.gifs || [];
}

export async function trending(limit = 20) {
  return fetchGifs("/trending", { limit });
}

export async function search(query, limit = 20) {
  const q = query.trim();
  if (!q) return trending(limit);
  return fetchGifs("/search", { q, limit });
}
