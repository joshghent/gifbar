<script>
  let { onsearch } = $props();

  let value = $state("");
  let debounceTimer = null;

  function handleInput() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      onsearch(value);
    }, 500);
  }

  function handleKeydown(e) {
    if (e.key === "Enter") {
      clearTimeout(debounceTimer);
      onsearch(value);
    }
  }
</script>

<div class="search-bar">
  <input
    type="text"
    placeholder="Search for GIFs..."
    bind:value
    oninput={handleInput}
    onkeydown={handleKeydown}
    autofocus
  />
</div>

<style>
  .search-bar {
    flex-shrink: 0;
  }

  input {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #333;
    border-radius: 8px;
    background: #16213e;
    color: #e0e0e0;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
  }

  input::placeholder {
    color: #666;
  }

  input:focus {
    border-color: #6c63ff;
  }
</style>
