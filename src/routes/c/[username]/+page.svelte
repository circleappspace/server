<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import Timeline from "../..//Timeline.svelte";
  import Cookies from "js-cookie";
  import "bootstrap-icons/font/bootstrap-icons.css";

  let username = $page.params.username;
  let circle = {};

  onMount(() => {
    fetch(`/api/v1/circles/username/${username}`)
      .then((res) => res.json())
      .then((data) => {
        circle = data;
      });
  });

  let mine = username === Cookies.get("username");
</script>

<Timeline {username} />

<div class="circle-info">
  <div class="name">{circle.name}</div>
  <div class="username">c/{circle.username}</div>
  <div class="bio">{circle.bio}</div>
</div>

{#if mine}
<div class="action-buttons">
  <a href="/settings/circle" class="edit-circle-button">
    <i class="bi bi-pencil-square"></i> 편집
  </a>
</div>
{/if}

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
