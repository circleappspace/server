<script>
  import BlowForm from "../../../BlowForm.svelte";
  import Bubble from "../../../Bubble.svelte";

  export let data;

  let { bubble } = data;
</script>

{#if bubble}
  <Bubble {bubble} />
{:else}
  <div>로딩 중 ...</div>
{/if}
<BlowForm anchor={bubble.id} redirectTo={`/b/${bubble.id}`} />
