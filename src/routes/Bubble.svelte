<script>
  import "bootstrap-icons/font/bootstrap-icons.css";
  import Cookies from "js-cookie";
  import dayjs from "dayjs";
  import relativeTime from "dayjs/plugin/relativeTime";
  import { onMount } from "svelte";
  import "dayjs/locale/ko";

  dayjs.locale("ko");

  export let bubble;

  const paragraphs = bubble.content.split("\n").filter((p) => p.trim() !== "");

  const username = Cookies.get("username");
  let mine = bubble.circle.username?.toLowerCase() === username?.toLowerCase();

  let popped = [];

  function react() {
    fetch(`/api/v1/bubbles/${bubble.id}/pops`, {
      method: isPopped ? "DELETE" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify({ emoji: "❤️" }),
    })
      .then((response) => response.json())
      .then(() => {
        if (isPopped) {
          popped = popped.filter((e) => e !== "❤️");
          bubble.pops_count = Number(bubble.pops_count) - 1;
          isPopped = false;
        } else {
          popped.push("❤️");
          bubble.pops_count = Number(bubble.pops_count) + 1;
          isPopped = true;
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

  let isPopped = false;
  onMount(() => {
    fetch(`/api/v1/bubbles/${bubble.id}/pops`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        popped = data;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  
    fetch(`/api/v1/bubbles/${bubble.id}/pops/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        isPopped = data.length > 0;
      })
      .catch((error) => console.error("Error:", error));
  });
</script>

<div class="bubble">
  <div class="self">
    {#if bubble.anchor}
      <div class="header">
        <a href="/b/{bubble.anchor}" style="text-decoration: none; color: inherit;" data-sveltekit-reload>
          <i class="bi bi-paperclip"></i> b/{bubble.anchor}
        </a>
      </div>
    {/if}
    <div class="circle">
      <span class="name">{bubble.circle.name}</span>
      <span class="username">
        <a href="/c/{bubble.circle.username}" data-sveltekit-reload>c/{bubble.circle.username}</a> ·
      </span>
      <span class="timestamp">
        <a href="/b/{bubble.id}" style="text-decoration: none; color: inherit;" data-sveltekit-reload>
          {formatTimestamp(bubble.timestamp)}
        </a>
      </span>
    </div>
    <div class="content">
      <a href="/b/{bubble.id}" style="text-decoration: none; color: inherit;" data-sveltekit-reload>
        {#each paragraphs as paragraph}
        <div class="paragraph">{paragraph}</div>
        {/each}
      </a>
    </div>
    {#if bubble.media.length > 0}
      <div class="media">
        {#each bubble.media as media}
        <img src="{media}" alt="Media" >
        {/each}
      </div>
    {/if}
    <div class="actions">
      {#if mine}
      <a href="/b/{bubble.id}/delete">
        <i class="bi bi-trash"></i> 삭제
      </a>
      {/if}
      <a href="/b/{bubble.id}/attach">
        <i class="bi bi-reply"></i> {bubble.anchoreds_count}
      </a>
      <button on:click={react}>
        {#if isPopped}
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
    padding: 8px;
    border-left: 4px solid var(--primary-color);
    border-radius: 0 5px 5px 0;
    transition: background-color 0.2s;
  }
  .bubble:hover {
    background-color: var(--hover-color);
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
    white-space: pre-wrap;
  }
  .actions {
    display: flex;
    gap: 15px;
    font-size: 0.9em;
    margin-top: 10px;
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
  .media img {
    margin-top: 10px;
    max-width: 100%;
    border-radius: 5px;
    object-fit: contain;
    max-height: 200px;
    object-position: center;
    overflow: hidden;
  }
  .media {
    height: 200px;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1px;
    flex-direction: row;
    margin-top: 10px;
  }

  button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: inherit;
    margin: 0;
  }
</style>
