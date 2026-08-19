# GifBar GIF proxy

A Cloudflare Worker that sits between the desktop app and the GIF providers.

## Why this exists

Vite inlines `import.meta.env` values into the JavaScript bundle at build
time. A GIPHY or Tenor key referenced from the frontend therefore ends up in
plain text inside every shipped `.app`, `.exe` and `.AppImage`, where `strings`
recovers it in seconds. Since the app is distributed publicly, that key is
effectively public the moment a release goes out.

Moving the calls here fixes that, and buys three other things:

- **Rotation without a release.** A rate-limited or abused key is replaced with
  `wrangler secret put`; already-installed apps pick it up on their next request.
- **One response shape.** GIPHY and Tenor are normalized server-side, so the app
  holds no provider-specific parsing.
- **Edge caching.** Responses are cached for 5 minutes, which is what keeps a
  shared key inside the providers' free tiers.

## Endpoints

| Route | Purpose |
| --- | --- |
| `GET /trending?limit=20` | Trending GIFs, interleaved from both providers |
| `GET /search?q=cats&limit=20` | Search; a blank `q` falls back to trending |
| `GET /health` | Returns `{"ok":true}` — the release workflow gates on this |

All return `{ "gifs": [{ id, title, preview, original, source }] }`.

`limit` is clamped to 1–50. If one provider fails the other still returns; a
502 means both did.

## Deploying

CI does it. `.github/workflows/worker.yml` deploys on any push to `master`
touching `worker/**`, and can be run by hand from the Actions tab
(**Deploy worker** -> Run workflow).

It needs one repository secret:

| Secret | How to get it |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Cloudflare dashboard -> My Profile -> API Tokens -> Create Token -> **Edit Cloudflare Workers** template |

### The provider keys

Deploying does **not** set the GIPHY and Tenor keys, and CI never sees them.
Set them once, directly against Cloudflare:

```shell
cd worker && npm install
npx wrangler login
npx wrangler secret put GIPHY_API_KEY
npx wrangler secret put TENOR_API_KEY
```

Or add them under the Worker's **Settings -> Variables and Secrets** in the
Cloudflare dashboard, which avoids installing anything locally.

They are deliberately not mirrored into GitHub secrets: they change maybe once
a year, and keeping them in one place is the entire point of this worker.
Secrets apply immediately — no redeploy needed.

### Which URL

The app falls back to `https://gifbar-api.joshghent.workers.dev`, so if the
worker deploys under that name nothing else is needed. If it lands elsewhere,
set the `VITE_GIF_API_BASE` **repository variable** to the deployed URL.

### Deploying by hand

```shell
cd worker && npm install && npx wrangler deploy
```

## Local development

Put the keys in `worker/.dev.vars` (gitignored — never commit it):

```
GIPHY_API_KEY=...
TENOR_API_KEY=...
```

```shell
npx wrangler dev          # serves on http://localhost:8787
```

Point the app at it with `VITE_GIF_API_BASE=http://localhost:8787` in the repo
root `.env`.

## Tests

```shell
npm test
```
