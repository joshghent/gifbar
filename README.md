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
- Click any GIF to copy its URL to clipboard
- Lightweight (~3 MB installer, ~30 MB RAM)
- Cross-platform: macOS, Windows, Linux

## Prerequisites

- [Node.js](https://nodejs.org/) 22+
- [Rust](https://rustup.rs/) (stable)
- Platform-specific dependencies:
  - **macOS**: Xcode Command Line Tools
  - **Linux**: `libwebkit2gtk-4.1-dev libgtk-3-dev librsvg2-dev`
  - **Windows**: Visual Studio C++ Build Tools + WebView2

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and add your API keys:
   ```
   VITE_GIPHY_API_KEY=your_giphy_key
   VITE_TENOR_API_KEY=your_tenor_key
   ```
3. Install dependencies:
   ```shell
   npm install
   ```

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

## Tech Stack

- **[Tauri v2](https://v2.tauri.app/)** — lightweight desktop framework (Rust backend, native webview)
- **[Svelte 5](https://svelte.dev/)** — reactive UI framework (compiles to vanilla JS)
- **[Vite](https://vite.dev/)** — frontend build tool
- **[Vitest](https://vitest.dev/)** — test framework

## Download

See all releases [here](https://github.com/joshghent/gifbar/releases).

## License

[MIT](./LICENSE)
