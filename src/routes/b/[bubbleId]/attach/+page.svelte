<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import Bubble from "../../../Bubble.svelte";
  import Cookies from 'js-cookie';

  let { bubbleId } = $page.params;
  let bubble;

  onMount(() => {
    fetch(`/api/v1/bubbles/${bubbleId}`)
      .then(response => response.json())
      .then(data => {
        bubble = data;
      });
  });

  function blowAnchoredBubble(event) {
    const formData = new FormData(event.target);
    const content = formData.get('content');
    const token = Cookies.get('token');

    fetch(`/api/v1/bubbles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ content, anchor: bubbleId })
    })
      .then(response => response.json())
      .then(data => {
        window.location.href = `/b/${bubbleId}`;
      });
  }
</script>

{#if bubble}
  <Bubble {bubble} />
{:else}
  <div>로딩 중 ...</div>
{/if}
<form on:submit|preventDefault={blowAnchoredBubble}>
  <textarea rows="10" name="content" placeholder="버블렛은 방울방울"></textarea>
  <button type="submit">불기</button>
</form>

<style>
  textarea {
    resize: none;
  }
</style>
