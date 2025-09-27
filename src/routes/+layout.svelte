<script>
  import Navigation from './Navigation.svelte';
</script>

<div class="container">
  <div class="footer">
    <img src="/circle-icon-cherry.PNG" alt="Logo" width="24" height="24" />
  </div>
  <slot />
  <Navigation />
  <div class="header">
    <img src="/circle-icon-cherry.PNG" alt="Logo" width="24" height="24" />
  </div>
</div>

<style>
  .container {
    font-family: 'Pretendard', sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 0 16px;
    box-sizing: border-box;
  }

  .header, .footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 0;
  }
</style>
