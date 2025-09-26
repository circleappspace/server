<script>
  import { onMount } from 'svelte';
  import Bubble from './Bubble.svelte';

  let bubbles = [];

  onMount(() => {
    fetch('/api/v1/bubbles')
      .then(response => response.json())
      .then(data => {
        bubbles = data;
      });
  });
</script>

<div class="timeline">
  {#each bubbles as bubble (bubble.id)}
    <Bubble {bubble} />
  {/each}
</div>
