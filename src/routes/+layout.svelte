<script>
  import Navigation from './Navigation.svelte';
</script>

<div class="container">
  <slot />
  <Navigation />
  <div class="header">
    <img src="/circle-icon-mint.PNG" alt="Logo" width="24" height="24" />
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

  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 0;
  }
</style>
