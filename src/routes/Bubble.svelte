<script>
  import "bootstrap-icons/font/bootstrap-icons.css";
  import Cookies from "js-cookie";
  import { onMount } from "svelte";
  import dayjs from "dayjs";
  import relativeTime from "dayjs/plugin/relativeTime";
  import "dayjs/locale/ko";

  dayjs.locale("ko");

  export let bubble;

  const paragraphs = bubble.content.split("\n").filter((p) => p.trim() !== "");

  const username = Cookies.get("username");
  let mine = bubble.circle.username?.toLowerCase() === username?.toLowerCase();

  let popped = [];

  onMount(() => {
    fetch(`/api/v1/bubbles/${bubble.id}/is_popped`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        popped = data.popped;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  function react() {
    fetch(`/api/v1/bubbles/${bubble.id}/pops`, {
      method: (popped.indexOf("❤️") !== -1) ? "DELETE" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify({ emoji: "❤️" }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (popped.indexOf("❤️") !== -1) {
          popped = popped.filter((e) => e !== "❤️");
          bubble.pops_count = Number(bubble.pops_count) - 1;
        } else {
          popped.push("❤️");
          bubble.pops_count = Number(bubble.pops_count) + 1;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function formatTimestamp(timestamp) {
    dayjs.extend(relativeTime);
    return dayjs(timestamp).fromNow();
  }
</script>

<div class="bubble">
  <div class="self">
    <div class="header">
      {#if bubble.anchor}
      <a href="/b/{bubble.anchor}" style="text-decoration: none; color: inherit;" data-sveltekit-reload>
        <i class="bi bi-paperclip"></i> b/{bubble.anchor}
      </a>
      {/if}
    </div>
    <div class="circle">
      <span class="name">{bubble.circle.name}</span>
      <span class="username">
        <a href="/c/{bubble.circle.username}" data-sveltekit-reload>c/{bubble.circle.username}</a> ·
      </span>
      <span class="timestamp">
        {formatTimestamp(bubble.timestamp)}
      </span>
    </div>
    <div class="content">
      <a href="/b/{bubble.id}" style="text-decoration: none; color: inherit;" data-sveltekit-reload>
        {#each paragraphs as paragraph}
        <div class="paragraph">{paragraph}</div>
        {/each}
      </a>
    </div>
    <div class="actions">
      {#if mine}
      <a href="/b/{bubble.id}/delete">
        <i class="bi bi-trash"></i> 삭제
      </a>
      {/if}
      <a href="/b/{bubble.id}/attach">
        <i class="bi bi-reply"></i> {bubble.anchoreds_count}
      </a>
      <button on:click={react} style="background: none; border: none; padding: 0; cursor: pointer;">
        {#if popped.length > 0}
        <i class="bi bi-emoji-smile-fill"></i>
        {:else}
        <i class="bi bi-emoji-smile"></i>
        {/if}
        {bubble.pops_count}
      </button>
    </div>
  </div>
  <slot></slot>
</div>

<style>
  .bubble {
    margin: 5px 0;
    padding: 0 10px;
    border-left: 4px solid var(--primary-color);
  }
  .self {
    display: flex;
    flex-direction: column;
  }
  .header {
    font-size: 0.9em;
    color: var(--secondary-text-color);
    margin-bottom: 5px;
  }
  .circle {
    font-weight: bold;
    margin-bottom: 5px;
  }
  .circle .username, .circle .timestamp {
    font-weight: normal;
    color: var(--secondary-text-color);
  }
  .timestamp {
    font-size: 0.8em;
  }
  .content {
    margin-bottom: 10px;
    white-space: pre-wrap;
  }
  .actions {
    display: flex;
    gap: 15px;
    font-size: 0.9em;
  }
  .actions a, .actions button {
    text-decoration: none;
  }
  .actions a:hover, .actions button:hover {
    color: var(--primary-color);
  }
  .actions button {
    font: inherit;
  }
  .actions i {
    margin-right: 5px;
  }
</style>
