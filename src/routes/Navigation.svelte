<script>
  import "bootstrap-icons/font/bootstrap-icons.css";

  export let username;
</script>

<div class="navigation">
  <div><a href="/"><i class="bi bi-house"></i> 홈</a></div>
  <div><a href="/search"><i class="bi bi-search"></i> 검색</a></div>
  {#if username}
  <div><a href="/notifications"><i class="bi bi-bell"></i> 알림</a></div>
  <div><a href="/c/{username}"><i class="bi bi-person-circle"></i> 서클</a></div>
  <div><a href="/blow"><i class="bi bi-wind"></i> 불기</a></div>
  <div><a href="/settings"><i class="bi bi-gear"></i> 설정</a></div>
  <div><a href="/logout"><i class="bi bi-box-arrow-right"></i> 로그아웃</a></div>
  {:else}
  <div><a href="/login"><i class="bi bi-box-arrow-in-right"></i> 로그인</a></div>
  <div><a href="/register"><i class="bi bi-person-plus"></i> 회원가입</a></div>
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
