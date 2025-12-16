<script>
  import { _ } from 'svelte-i18n';
  import { onMount, tick } from 'svelte';
  import "bootstrap-icons/font/bootstrap-icons.css";
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import 'dayjs/locale/ko';
  import 'dayjs/locale/en';
  import { userLanguage } from '$lib/i18n/store';

  $: dayjs.locale($userLanguage);

  export let data;
  let { notifications } = data;

  onMount(async () => {
    notifications = notifications.map(
      (n, i) => ({
        ...JSON.parse(n.content),
        timestamp: n.created_at,
        circle: n.circle,
        id: i
      }
    )).reverse();

    await tick();
    window.scrollTo(0, document.body.scrollHeight);
  });

  function formatTimestamp(timestamp) {
    dayjs.extend(relativeTime);
    return dayjs(timestamp).fromNow();
  }
</script>

{#if notifications.length === 0}
  <div>{$_("notifications.no_notifications")}</div>
{:else}
  {#each notifications as notification (notification.id)}
  <div class="notification">
    <div class="icon">
      {#if notification.type === 'join'}
        <i class="bi bi-person-plus"></i>
      {:else if notification.type === 'pop'}
        <i class="bi bi-heart"></i>
      {:else if notification.type === 'bubblet'}
        <i class="bi bi-chat-dots"></i>
      {:else}
        <i class="bi bi-info-circle"></i>
      {/if}
    </div>
    <div class="content">
      <div class="message">
        {#if notification.type === 'join'}
          <a href="c/{notification.circle_username}" class="circle-name">{notification.circle.name}</a>
          {$_("notifications.joined_circle")}
        {:else if notification.type === 'pop'}
          <a href="c/{notification.circle_username}" class="circle-name">{notification.circle.name}</a>
          {$_("notifications.popped_text")}
          <a href="b/{notification.bubble_id}" class="my-bubble">{$_("bubble.my")}</a>
          {$_("notifications.popped_end")}
        {:else if notification.type === 'bubblet'}
          <a href="b/{notification.bubble_id}" class="my-bubble">{$_("bubble.my")}</a>
          {$_("notifications.bubblet_added_start")}
          <a href="b/{notification.bubblet_id}" class="new-bubblet">{$_("bubble.new_bubblet")}</a>
          {$_("notifications.bubblet_added_end")}
        {:else}
          {$_("notifications.unknown_notification")}
        {/if}
      </div>
      <div class="timestamp">
        {formatTimestamp(notification.timestamp)}
      </div>
    </div>
  </div>
  {/each}
{/if}

<style>
  .notification {
    display: flex;
    align-items: center;
    padding: 10px;
    transition: background-color 0.2s;
    border-radius: 8px;
  }
  .notification:hover {
    background-color: var(--hover-color);
  }
  .icon {
    font-size: 24px;
    margin-right: 10px;
  }
  .content {
    flex: 1;
  }
  .message {
    font-size: 14px;
    margin-bottom: 5px;
  }
  .timestamp {
    font-size: 12px;
    color: #888;
  }
  a {
    text-decoration: none;
  }

  .circle-name {
    font-weight: bold;
  }

  .my-bubble {
    font-weight: bold;
  }

  .new-bubblet {
    font-weight: bold;
  }
</style>
