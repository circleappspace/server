<script>
  import Cookies from 'js-cookie';
  import { onMount } from 'svelte';
  import "bootstrap-icons/font/bootstrap-icons.css";

  let token = Cookies.get('token');
  let username = Cookies.get('username');
</script>

<div class="navigation">
  <div><a href="/" data-sveltekit-reload><i class="bi bi-house"></i> 홈</a></div>
  {#if token}
  <div><a href="/logout"><i class="bi bi-box-arrow-right"></i> 로그아웃</a></div>
  <div><a href="/blow"><i class="bi bi-wind"></i> 불기</a></div>
  <div><a href="/settings"><i class="bi bi-gear"></i> 설정</a></div>
  <div><a href="/c/{username}" data-sveltekit-reload><i class="bi bi-person-circle"></i> 서클</a></div>
  {:else}
  <div><a href="/login" data-sveltekit-reload><i class="bi bi-box-arrow-in-right"></i> 로그인</a></div>
  <div><a href="/register" data-sveltekit-reload><i class="bi bi-person-plus"></i> 회원가입</a></div>
  {/if}
</div>

<style>
  .navigation {
    display: flex;
    gap: 1rem;
    padding: 0.5rem 1rem;
    justify-content: center;
    flex-wrap: wrap;
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
