<script>
  import Navigation from './Navigation.svelte';

  export let data;

  const { username } = data;
</script>

<svelte:head>
  <title>Circle</title>
  <link rel="icon" type="image/png" href="/circle-icon-mint.PNG" />
</svelte:head>

<div class="container">
  <slot />
  <Navigation {username} />
  <div class="header">
    <div><img src="/circle-icon-mint.PNG" alt="Logo" width="24" height="24" /></div>
    <div><a href="https://github.com/circleappspace/server"><img src="/github-mark.svg" alt="GitHub" width="24" height="24" /></a></div>
  </div>
</div>

<style>
  .container {
    font-family: 'Pretendard', sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 0 16px;
    box-sizing: border-box;
  }

  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 0;
    gap: 16px;
  }
</style>
