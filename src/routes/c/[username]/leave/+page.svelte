<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Cookies from "js-cookie";

  export let data;

  let circle = data.circle;

  onMount(() => {
    const token = Cookies.get("token");
    fetch(`/api/v1/circles/${circle.id}/joinedbys`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        window.location.href = `/c/${circle.username}`;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
</script>
