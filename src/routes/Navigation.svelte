<script>
  import Cookies from 'js-cookie';
  import { onMount } from 'svelte';
  import "bootstrap-icons/font/bootstrap-icons.css";

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

  function home(event) {
    event.preventDefault();
    if (window.location.pathname === '/') {
      window.location.reload();
      return;
    }
    window.location.href = '/';
  }
</script>

<div class="navigation">
  <div><a href="/" on:click={home}><i class="bi bi-house"></i> 홈</a></div>
  {#if token}
  <div><a href="/logout"><i class="bi bi-box-arrow-right"></i> 로그아웃</a></div>
  <div><a href="/blow"><i class="bi bi-wind"></i> 불기</a></div>
  <div><a href="/c/{myUsername}"><i class="bi bi-person-circle"></i> 서클</a></div>
  {:else}
  <div><a href="/login"><i class="bi bi-box-arrow-in-right"></i> 로그인</a></div>
  <div><a href="/register"><i class="bi bi-person-plus"></i> 회원가입</a></div>
  {/if}
</div>

<style>
  .navigation {
    display: flex;
    gap: 1rem;
    padding: 0.5rem 1rem;
    justify-content: center;
  }
  .navigation div {
    display: flex;
    align-items: center;
  }
  .navigation a {
    text-decoration: none;
    color: #343a40;
    font-weight: 500;
  }
  .navigation a:hover {
    color: #007bff;
  }
  .bi { margin-right: 0.5rem; }
</style>
