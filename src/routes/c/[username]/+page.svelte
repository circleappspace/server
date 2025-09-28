<script>
  import { onMount } from "svelte";
  import Cookies from "js-cookie";
  import "bootstrap-icons/font/bootstrap-icons.css";
  import { page } from "$app/stores";

  export let data;

  let circle = data.circle;

  const username = $page.params.username;
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

<div class="action-buttons">
{#if token}
  {#if mine}
  <a href="/settings/circle" class="edit-circle-button">
    <i class="bi bi-pencil-square"></i> 편집
  </a>
  {/if}
  {#if joined}
  <a href="/c/{username}/leave" class="leave-circle-button">
    <i class="bi bi-dash-circle"></i> 탈퇴
  </a>
  {:else}
  <a href="/c/{username}/join" class="join-circle-button">
    <i class="bi bi-plus-circle"></i> 가입
  </a>
  {/if}
{/if}
</div>

<style>
  .action-buttons {
    display: flex;
    justify-content: center;
    margin: 20px;
    gap: 10px;
  }
</style>
