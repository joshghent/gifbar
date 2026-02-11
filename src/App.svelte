<script>
  import SearchBar from "./lib/SearchBar.svelte";
  import GifGrid from "./lib/GifGrid.svelte";
  import Spinner from "./lib/Spinner.svelte";
  import { trending, search } from "./lib/gif-api.js";

  let gifs = $state([]);
  let loading = $state(true);
  let copiedId = $state(null);

  async function loadTrending() {
    loading = true;
    gifs = await trending();
    loading = false;
  }

  async function handleSearch(query) {
    loading = true;
    gifs = await search(query);
    loading = false;
  }

  function handleCopied(id) {
    copiedId = id;
    setTimeout(() => {
      copiedId = null;
    }, 1500);
  }

  loadTrending();
</script>

<div class="container">
  <SearchBar onsearch={handleSearch} />

  {#if loading}
    <Spinner />
  {:else if gifs.length === 0}
    <div class="empty">No GIFs found. Try a different search!</div>
  {:else}
    <GifGrid {gifs} {copiedId} oncopied={handleCopied} />
  {/if}

  <footer class="attribution">
    Powered by GIPHY & Tenor
  </footer>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding: 8px;
    gap: 8px;
  }

  .empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #888;
    font-size: 14px;
  }

  .attribution {
    text-align: center;
    font-size: 10px;
    color: #666;
    padding: 4px 0;
    flex-shrink: 0;
  }
</style>
