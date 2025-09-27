<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import Bubble from "../../Bubble.svelte";

  let { bubbleId } = $page.params;
  let bubble;

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
        anchoreds = reverse(data);
      });
  });
</script>

{#if bubble}
<Bubble {bubble}>
  {#each anchoreds as anchored}
    <Bubble bubble={anchored} />
  {/each}
</Bubble>
{:else}
<div>로딩 중 ...</div>
{/if}
