<script>
  import Cookies from 'js-cookie';
  import { onMount } from 'svelte';

  export let data;

  let circle = data.circle;

  onMount(() => {
    const token = Cookies.get("token");
    fetch(`/api/v1/circles/${circle.id}/joinedbys`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).then(response => response.json())
      .then(data => {
        window.location.href = `/c/${circle.username}`;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
</script>
