<script>
  import { onMount, tick } from 'svelte';
  import Bubble from './Bubble.svelte';

  let bubbles = [];

  onMount(() => {
    fetch('/api/v1/bubbles')
      .then(response => response.json())
      .then(async data => {
        bubbles = data.reverse();
        await tick();
        window.scrollTo(0, document.body.scrollHeight);
      });

  });
</script>

<div class="timeline">
  {#each bubbles as bubble (bubble.id)}
    <Bubble {bubble} />
  {/each}
</div>
