<script>
  import Circles from "../Circles.svelte";

  let name = "";

  let circles = [];

  $: if (name.length > 1) {
    fetch(`/api/v1/circles/search/${encodeURIComponent(name)}`)
      .then((res) => res.json())
      .then((data) => {
        circles = data;
      });
  } else {
    circles = [];
  }
</script>

<input type="text" bind:value={name} />

<Circles {circles} />
