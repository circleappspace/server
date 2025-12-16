<script>
  import Bubble from "../../Bubble.svelte";

  export let data;

  $: bubble = data.bubble;
</script>

<svelte:head>
  <meta name="og:title" content="Circle" />
  <meta name="og:image" content="/circle-icon-mint.PNG" />
  <meta name="og:description" content="{bubble.content}" />
  <meta name="og:url" content="https://circleapp.space/b/{bubble.id}" />
  <meta name="og:type" content="website" />
  <title>{bubble ? `b/${bubble.id} - Circle` : 'Circle'}</title>
</svelte:head>

<Bubble {bubble} />
