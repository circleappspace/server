<script>
  import "bootstrap-icons/font/bootstrap-icons.css";
  import { page } from '$app/stores';

  export let username;

  $: path = $page.url.pathname;
</script>

<div class="navigation">
  <div><a href="/">
    {#if path === '/'}
      <i class="bi bi-house-fill"></i>
    {:else}
      <i class="bi bi-house"></i>
    {/if}
    홈
  </a></div>
  <div><a href="/search">
    {#if path === '/search'}
      <i class="bi bi-search-heart-fill"></i>
    {:else}
      <i class="bi bi-search-heart"></i>
    {/if}
    검색
  </a></div>
  {#if username}
    <div><a href="/notifications">
      {#if path === '/notifications'}
        <i class="bi bi-bell-fill"></i>
      {:else}
        <i class="bi bi-bell"></i>
      {/if}
      알림
    </a></div>
    <div><a href="/c/{username}">
      {#if path === `/c/${username}`}
        <i class="bi bi-file-person-fill"></i>
      {:else}
        <i class="bi bi-file-person"></i>
      {/if}
      서클
    </a></div>
    <div><a href="/blow">
      {#if path === '/blow'}
        <i class="bi bi-chat-fill"></i>
      {:else}
        <i class="bi bi-chat"></i>
      {/if}
      블로우
    </a></div>
    <div><a href="/settings">
      {#if path === '/settings'}
        <i class="bi bi-gear-fill"></i>
      {:else}
        <i class="bi bi-gear"></i>
      {/if}
      설정
    </a></div>
    <div><a href="/logout"><i class="bi bi-box-arrow-right"></i> 로그아웃</a></div>
  {:else}
    <div><a href="/login">
      {#if path === '/login'}
        <i class="bi bi-door-closed-fill"></i>
      {:else}
        <i class="bi bi-door-closed"></i>
      {/if}
      로그인
    </a></div>
    <div><a href="/register">
      {#if path === '/register'}
        <i class="bi bi-pencil-fill"></i>
      {:else}
        <i class="bi bi-pencil"></i>
      {/if}
      회원가입
    </a></div>
  {/if}
</div>

<style>
  .navigation {
    display: flex;
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
    padding: 8px 12px;
    border-radius: 999px;
    transition: 0.2s background-color;
  }
  .navigation a:hover {
    background-color: var(--hover-color);
  }

  .bi { margin-right: 0.5rem; }
</style>
