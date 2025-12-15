<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import Bubble from "../../Bubble.svelte";

  export let data;

  let { bubbleId } = $page.params;
  let bubble = null;

  if (!bubble) {
    bubble = data.bubble;
  }

  let anchoreds = [];

  onMount(() => {
    fetch(`/api/v1/bubbles/${bubbleId}`)
      .then((res) => res.json())
      .then((data) => {
        bubble = data;
        console.log(bubble);
      });

    fetch(`/api/v1/bubbles/${bubbleId}/anchoreds`)
      .then((res) => res.json())
      .then((data) => {
        anchoreds = data.reverse();
      });
  });
</script>

<svelte:head>
  <meta name="og:title" content="Circle" />
  <meta name="og:image" content="/circle-icon-mint.PNG" />
  <meta name="og:description" content="{bubble.content}" />
  <meta name="og:url" content="https://circleapp.space/b/{bubbleId}" />
  <meta name="og:type" content="website" />
  <title>{bubble ? `b/${bubble.id} - Circle` : 'Circle'}</title>
</svelte:head>

{#if bubble}
<Bubble {bubble} autoBubbletCount={0}>
  {#each anchoreds as anchored}
    <Bubble bubble={anchored} />
  {/each}
</Bubble>
{:else}
<div>로딩 중 ...</div>
{/if}
