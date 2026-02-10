<script>
  import { writeText } from "@tauri-apps/plugin-clipboard-manager";

  let { gifs, copiedId, oncopied } = $props();

  async function copyGif(gif) {
    try {
      // Try Tauri clipboard first, fall back to browser API
      await writeText(gif.original);
    } catch {
      try {
        await navigator.clipboard.writeText(gif.original);
      } catch {
        // silently fail
      }
    }
    oncopied(gif.id);
  }
</script>

<div class="grid-container">
  <div class="grid">
    {#each gifs as gif (gif.id)}
      <button
        class="gif-item"
        class:copied={copiedId === gif.id}
        onclick={() => copyGif(gif)}
        title={gif.title || "Click to copy GIF URL"}
      >
        <img src={gif.preview} alt={gif.title} loading="lazy" />
        {#if copiedId === gif.id}
          <div class="copied-overlay">Copied!</div>
        {/if}
      </button>
    {/each}
  </div>
</div>

<style>
  .grid-container {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 6px;
  }

  .gif-item {
    position: relative;
    border: 2px solid transparent;
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;
    background: #16213e;
    padding: 0;
    transition: border-color 0.2s, transform 0.15s;
    aspect-ratio: 1;
  }

  .gif-item:hover {
    border-color: #6c63ff;
    transform: scale(1.03);
  }

  .gif-item.copied {
    border-color: #4caf50;
  }

  .gif-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .copied-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(76, 175, 80, 0.85);
    color: white;
    font-weight: 600;
    font-size: 13px;
  }
</style>
