<script>
  import { onMount, tick } from 'svelte';
  import Bubble from './Bubble.svelte';

  export let username = "";

  let bubbles = [];

  onMount(() => {
    const url = username.length > 0
      ? `/api/v1/circles/username/${username}/bubbles`
      : `/api/v1/bubbles`;
    fetch(url)
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
