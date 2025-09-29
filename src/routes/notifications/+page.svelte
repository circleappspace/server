<script>
  import { onMount } from 'svelte';
  import "bootstrap-icons/font/bootstrap-icons.css";

  export let data;
  let { notifications } = data;

  onMount(() => {
    notifications = notifications.map(
      (n, i) => ({
        ...JSON.parse(n.content),
        timestamp: n.timestamp,
        id: i
      }
    )).reverse();
  });
</script>

{#if notifications.length === 0}
  <div>알림이 없습니디.</div>
{:else}
  {#each notifications as notification (notification.id)}
    <div class="notification">
      {#if notification.type === 'join'}
        <span class="icon">
          <i class="bi bi-person-plus"></i>
        </span>
        <span class="message">
          가입했습니다.
        </span>
      {:else if notification.type === 'pop'}
        <span class="icon">
          <i class="bi bi-bell"></i>
        </span>
        <span class="message">
          버블이 팝되었습니다.
        </span>
      {:else if notification.type === 'bubblet'}
        <span class="icon">
          <i class="bi bi-chat-dots"></i>
        </span>
        <span class="message">
          버블렛이 도착했습니다.
        </span>
      {:else}
        <span class="icon">
          <i class="bi bi-info-circle"></i>
        </span>
        <span class="message">
          알림이 도착했습니다.
        </span>
      {/if}
      <div class="timestamp">
        {new Date(notification.timestamp).toLocaleString()}
      </div>
    </div>
  {/each}
{/if}

<style>
  .notification {
    display: flex;
    align-items: center;
    padding: 10px;
  }
  .icon {
    margin-right: 10px;
    font-size: 1.5em;
  }
  .message {
    font-size: 1em;
  }
  .timestamp {
    margin-left: auto;
    font-size: 0.8em;
    color: gray;
  }
</style>
