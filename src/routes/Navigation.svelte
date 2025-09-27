<script>
  import Cookies from 'js-cookie';

  let token = Cookies.get('token');
  console.log('Token:', token);
</script>

<div class="navigation">
  <div><a href="/">홈</a></div>
  {#if token}
    <div><a href="/logout">로그아웃</a></div>
    <div><a href="/blow">불기</a></div>
  {:else}
    <div><a href="/login">로그인</a></div>
    <div><a href="/register">가입</a></div>
  {/if}
</div>
