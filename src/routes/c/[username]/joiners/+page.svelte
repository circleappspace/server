<script>
  import Circles from "../../../Circles.svelte";
  import { onMount } from "svelte";

  export let data;
  const { circle } = data;

  let circles = [];
  onMount(() => {
    fetch(`/api/v1/circles/${circle.id}/joinedbys`)
      .then((response) => response.json())
      .then((data) => {
        circles = data;
      });
  });
</script>

<Circles {circles} />
