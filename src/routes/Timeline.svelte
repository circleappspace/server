<script>
  import { onMount, tick } from 'svelte';
  import Bubble from './Bubble.svelte';
  import Cookies from 'js-cookie';

  export let username;

  let bubbles = [];
  const token = Cookies.get('token');
  const seeAllBubbles = Cookies.get('seeAllBubbles') === 'true';

  onMount(() => {
    const url = username
      ? `/api/v1/circles/username/${username}/bubbles`
      : (!seeAllBubbles && token)
      ? `/api/v1/feed`
      : `/api/v1/bubbles`;
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(async data => {
        bubbles = data.reverse();
        await tick();
        window.scrollTo(0, document.body.scrollHeight);
      })
      .catch(error => {
        console.error('Error fetching bubbles:', error);
      });
  });
</script>

<div class="timeline">
  {#each bubbles as bubble (bubble.id)}
    <Bubble {bubble} />
  {/each}
</div>
