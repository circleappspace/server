<script>
  import { onMount } from "svelte";
  import Cookies from "js-cookie";
  import "bootstrap-icons/font/bootstrap-icons.css";
  import Timeline from "../../Timeline.svelte";
  import { page } from "$app/stores";

  export let data;

  let username = $page.params.username;
  let circle = data.circle;

  const mine = username === Cookies.get("username");
  const token = Cookies.get("token");

  let joined = false;

  onMount(() => {
    fetch(`/api/v1/circles/${circle.id}/is_joined`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        joined = data.joined;
      });
  });
</script>

<Timeline {username} />
<div class="circle-info">
  <div class="name">{circle.name}</div>
  <div class="username">c/{circle.username}</div>
  <div class="bio">{circle.bio}</div>
</div>
<div class="action-buttons">
  <a href="/c/{username}/joins" class="view-members-button">
    <i class="bi bi-people"></i> 참가 {circle.joins_count}
  </a>
  <a href="/c/{username}/joiners" class="view-joiners-button">
    <i class="bi bi-people"></i> 참가자 {circle.joinedbys_count}
  </a>
  {#if token}
    {#if mine}
    <a href="/settings/circle" class="edit-circle-button">
      <i class="bi bi-pencil-square"></i> 편집
    </a>
    {/if}
    {#if joined}
    <a href="/c/{username}/leave" class="leave-circle-button">
      <i class="bi bi-dash-circle"></i> 나가기
    </a>
    {:else}
    <a href="/c/{username}/join" class="join-circle-button">
      <i class="bi bi-plus-circle"></i> 참가
    </a>
    {/if}
  {/if}
</div>

<style>
  .circle-info {
    text-align: center;
    margin: 20px 0;
  }

  .name {
    font-size: 24px;
    font-weight: bold;
  }

  .username {
    font-size: 18px;
    color: #666;
  }

  .bio {
    margin-top: 10px;
    font-size: 16px;
    color: #333;
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    margin: 20px;
    gap: 10px;
  }
</style>
