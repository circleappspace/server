<script>
  import { onMount, tick } from 'svelte';
  import Bubble from './Bubble.svelte';

  export let bubbles = [];

  onMount(async () => {
    await tick();
    window.scrollTo(0, document.body.scrollHeight);
  });
</script>

<div class="timeline">
  {#each bubbles.reverse() as bubble (bubble.id)}
    <Bubble {bubble} />
  {/each}
</div>
