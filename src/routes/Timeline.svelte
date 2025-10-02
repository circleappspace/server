<script>
  import { onMount, tick } from 'svelte';
  import Bubble from './Bubble.svelte';
  import Cookies from 'js-cookie';

  export let bubbles = [];

  bubbles.reverse();

  onMount(async () => {
    await tick();
    window.scrollTo(0, document.body.scrollHeight);
  });
</script>

<div class="timeline">
  {#each bubbles as bubble (bubble.id)}
    <Bubble {bubble} />
  {/each}
</div>
