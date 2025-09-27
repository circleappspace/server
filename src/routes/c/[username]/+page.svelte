<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import Timeline from "../..//Timeline.svelte";

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

<Timeline {username} />

<div>{circle.name}</div>
<div>c/{circle.username}</div>
<div>{circle.bio}</div>
