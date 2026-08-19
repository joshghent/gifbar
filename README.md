<div align="center">
	<img height="250" src="./assets/gif-original-full-size.png" alt="gifbar logo">
	<h1><b>GifBar</b></h1>
	<p><b>A menu bar app for searching, copying and sharing GIFs</b></p>
	<p>Works on macOS, Windows, and Linux</p>
</div>

## Demo

![demo video](./demo.gif)

## Features

- Lives in your system tray / menu bar
- Search GIFs from GIPHY and Tenor
- Click any GIF to copy **the image itself** — paste straight into Teams, Slack or Outlook and it arrives animated, not as a link
- Lightweight (~3 MB installer, ~30 MB RAM)
- Cross-platform: macOS, Windows, Linux

## Prerequisites

- [Node.js](https://nodejs.org/) 22+
- [Rust](https://rustup.rs/) (stable)
- Platform-specific dependencies:
  - **macOS**: Xcode Command Line Tools
  - **Linux**: `libwebkit2gtk-4.1-dev libgtk-3-dev librsvg2-dev`
  - **Windows**: Visual Studio C++ Build Tools + WebView2

## Installing

Grab the installer for your platform from the [latest release](https://github.com/joshghent/gifbar/releases/latest).

### macOS: first launch

The app is **not signed with an Apple Developer ID**, so Gatekeeper blocks it on
first open. This is expected — right-click the app in Applications and choose
**Open**, then confirm. You only do this once.

If macOS insists the app "is damaged and can't be opened", that is the quarantine
attribute rather than a real problem:

```shell
xattr -cr /Applications/GifBar.app
```

## Setup (development)

1. Clone the repository
2. Install dependencies:
   ```shell
   npm install
   ```
3. Optionally point the app at your own GIF proxy — it defaults to the deployed
   one, so this is only needed if you are running the Worker locally:
   ```shell
   cp .env.example .env   # then set VITE_GIF_API_BASE=http://localhost:8787
   ```

### Where the API keys live

The app ships **no API keys**. Vite inlines `import.meta.env` values into the
JavaScript bundle at build time, so a key referenced from the frontend ends up
in plain text inside every shipped `.app` and `.exe`, recoverable with `strings`
in seconds.

Instead, GIPHY and Tenor are called from a Cloudflare Worker in [`worker/`](./worker),
which holds the keys as encrypted secrets and normalizes both providers into one
response shape. The desktop app only ever talks to that Worker. A leaked or
rate-limited key can be rotated with `wrangler secret put` — no new release.

To deploy your own:

```shell
cd worker
npm install
npx wrangler secret put GIPHY_API_KEY
npx wrangler secret put TENOR_API_KEY
npx wrangler deploy
```

Then set the `VITE_GIF_API_BASE` repository variable in GitHub Actions to the
URL that `wrangler deploy` prints.

## Development

```shell
npm run tauri dev
```

## Testing

```shell
npm test
```

## Building

```shell
npm run tauri build
```

This produces platform-specific installers:
- **macOS**: `.dmg` in `src-tauri/target/release/bundle/dmg/`
- **Windows**: `.exe` installer in `src-tauri/target/release/bundle/nsis/`
- **Linux**: `.deb` and `.AppImage` in `src-tauri/target/release/bundle/`

## Releasing

Releases are cut by [release-please](https://github.com/googleapis/release-please)
from conventional commits — you never tag by hand.

1. Land conventional commits on `master` (`feat:`, `fix:`, …).
2. release-please keeps a release PR open with the version bump and changelog.
   Merging it is what cuts the release.
3. `.github/workflows/release.yml` then tags, builds installers for macOS
   (Apple Silicon + Intel), Windows and Linux, and uploads them to a **draft**
   release.
4. The `publish` job checks a `.dmg`, `.AppImage`, `.deb` and `.exe` are all
   attached before flipping the release live.

The draft step matters: a published GitHub release is immutable, so assets have
to land before it goes live.

Required GitHub Actions configuration:

| Name | Kind | Purpose |
| --- | --- | --- |
| `TAURI_SIGNING_PRIVATE_KEY` | secret | signs updater artifacts (`npx tauri signer generate`) |
| `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` | secret | password for the above |
| `VITE_GIF_API_BASE` | variable | URL of the deployed GIF proxy Worker |

Note that CI itself needs **no** secrets, which is what keeps Dependabot's
builds green — Dependabot events get an empty secrets context.

## Tech Stack

- **[Tauri v2](https://v2.tauri.app/)** — lightweight desktop framework (Rust backend, native webview)
- **[Svelte 5](https://svelte.dev/)** — reactive UI framework (compiles to vanilla JS)
- **[Vite](https://vite.dev/)** — frontend build tool
- **[Vitest](https://vitest.dev/)** — test framework
- **[Cloudflare Workers](https://workers.cloudflare.com/)** + **[Hono](https://hono.dev/)** — the GIF proxy that keeps API keys off users' machines

## Download

See all releases [here](https://github.com/joshghent/gifbar/releases).

## License

[MIT](./LICENSE)
