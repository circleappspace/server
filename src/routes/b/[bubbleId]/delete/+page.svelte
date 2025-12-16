<script>
  import Cookies from 'js-cookie';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  const { bubbleId } = $page.params;

  onMount(() => {
    const token = Cookies.get('token');
    fetch(`/api/v1/bubbles/${bubbleId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(() => {
        window.location.href = '/';
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });
</script>
