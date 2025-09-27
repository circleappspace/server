<script>
  import Navigation from './Navigation.svelte';
</script>

<div class="container">
  <div class="footer">서클</div>
  <slot />
  <Navigation />
  <div class="header">서클</div>
</div>

<style>
  .container {
    font-family: 'Pretendard', sans-serif;
  }
</style>
