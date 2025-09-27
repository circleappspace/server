<script>
  import Cookies from 'js-cookie';
  import { onMount } from 'svelte';

  let token = Cookies.get('token');
  let myUsername;

  onMount(() => {
    if (!token) return;

    fetch('/api/v1/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      myUsername = data.username;
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
      token = null;
      Cookies.remove('token');
    });
  });
</script>

<div class="navigation">
  <div><a href="/">홈</a></div>
  {#if token}
    <div><a href="/logout">로그아웃</a></div>
    <div><a href="/blow">불기</a></div>
    <div><a href="/c/{myUsername}">내 서클</a></div>
  {:else}
    <div><a href="/login">로그인</a></div>
    <div><a href="/register">가입</a></div>
  {/if}
</div>
