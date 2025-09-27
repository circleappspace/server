<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  let username = $page.params.username;
  let circle = {};

  onMount(() => {
    fetch(`/api/v1/circles/username/${username}`)
      .then((res) => res.json())
      .then((data) => {
        circle = data;
      });
  });
</script>

<div>{circle.name}</div>
<div>c/{circle.username}</div>
<div>{circle.bio}</div>
