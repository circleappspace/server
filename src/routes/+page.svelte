<script>
  import Timeline from './Timeline.svelte';

  export let data;

  const {bubbles} = data;
</script>

<Timeline {bubbles} />
