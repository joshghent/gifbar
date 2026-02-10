<div class="spinner-container">
  <div class="spinner"></div>
</div>

<style>
  .spinner-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .spinner {
    width: 36px;
    height: 36px;
    border: 3px solid #333;
    border-top-color: #6c63ff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
