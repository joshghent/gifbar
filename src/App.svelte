<script>
  import SearchBar from "./lib/SearchBar.svelte";
  import GifGrid from "./lib/GifGrid.svelte";
  import Spinner from "./lib/Spinner.svelte";
  import { trending, search } from "./lib/gif-api.js";

  let gifs = $state([]);
  let loading = $state(true);
  let copiedId = $state(null);
  let error = $state(null);

  // The API client throws rather than swallowing failures, so the one place
  // that can actually show the user something is here.
  async function load(fetcher) {
    loading = true;
    error = null;
    try {
      gifs = await fetcher();
    } catch (e) {
      console.error(e);
      gifs = [];
      error = "Couldn't reach the GIF service. Check your connection.";
    } finally {
      loading = false;
    }
  }

  const loadTrending = () => load(() => trending());
  const handleSearch = (query) => load(() => search(query));

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
  {:else if error}
    <div class="empty error">{error}</div>
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

  .error {
    color: #ff8a80;
    padding: 0 16px;
    text-align: center;
  }

  .attribution {
    text-align: center;
    font-size: 10px;
    color: #666;
    padding: 4px 0;
    flex-shrink: 0;
  }
</style>
