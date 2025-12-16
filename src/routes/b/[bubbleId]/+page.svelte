<script>
  import { _ } from 'svelte-i18n';
  import Bubble from "../../Bubble.svelte";

  export let data;

  $: bubble = data.bubble;
</script>

<svelte:head>
  <meta name="og:title" content="{$_("ui.circle")}" />
  <meta name="og:image" content="/circle-icon-mint.PNG" />
  <meta name="og:description" content="{bubble.content}" />
  <meta name="og:url" content="https://circleapp.space/b/{bubble.id}" />
  <meta name="og:type" content="website" />
  <title>{bubble ? `b/${bubble.id} - ${$_("ui.circle")}` : $_("ui.circle")}</title>
</svelte:head>

<Bubble {bubble} />
