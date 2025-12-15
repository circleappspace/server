<script>
  import { onMount, tick } from 'svelte';
  import "bootstrap-icons/font/bootstrap-icons.css";
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import 'dayjs/locale/ko';

  dayjs.locale('ko');

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
  <div>알림이 없습니다.</div>
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
          <a href="c/{notification.circle_username}" class="circle-name">{notification.circle.name}</a>님이
          내 서클에 가입했습니다.
        {:else if notification.type === 'pop'}
          <a href="c/{notification.circle_username}" class="circle-name">{notification.circle.name}</a>님이
          <a href="b/{notification.bubble_id}" class="my-bubble">내 버블</a>을
          팝했습니다.
        {:else if notification.type === 'bubblet'}
          <a href="b/{notification.bubble_id}" class="my-bubble">내 버블</a>에
          <a href="b/{notification.bubblet_id}" class="new-bubblet">새로운 버블렛</a>이
          추가되었습니다.
        {:else}
          알림이 도착했습니다.
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
