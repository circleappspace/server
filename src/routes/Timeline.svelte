<script>
  import Bubble from './Bubble.svelte';
  import { onMount } from 'svelte';

  let bubbles = [];

  onMount(async () => {
    const response = await fetch('/api/v1/bubbles');
    bubbles = await response.json();
  });
</script>

<div>
  {#if bubbles.length === 0}
    <div>로딩 중...</div>
  {:else}
    {#each bubbles as bubble}
    <Bubble {bubble} />
    {/each}
  {/if}
</div>
