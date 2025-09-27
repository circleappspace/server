<script>
  import { onMount } from "svelte";
  import "bootstrap-icons/font/bootstrap-icons.css";
  import Cookies from "js-cookie";

  export let bubble;

  const paragraphs = bubble.content.split("\n").filter((p) => p.trim() !== "");

  const username = Cookies.get("username");
  let mine = bubble.circle.username === username;
</script>

<a href="/b/{bubble.id}" style="text-decoration: none; color: inherit;" data-sveltekit-reload>
  <div class="bubble">
    <div class="self">
      <div class="header">
        {#if bubble.anchor}
        <a href="/b/{bubble.anchor}" style="text-decoration: none; color: inherit;" data-sveltekit-reload>
          <i class="bi bi-paperclip"></i> b/{bubble.anchor}
        </a>
        {/if}
      </div>
      <div class="name">{bubble.circle.name}</div>
      <div class="content">
        {#each paragraphs as paragraph}
        <div class="paragraph">{paragraph}</div>
        {/each}
      </div>
      <div class="footer">
        {new Date(bubble.timestamp).toLocaleString()} ·
        <a href="/c/{bubble.circle.username}">c/{bubble.circle.username}</a>
      </div>
      <div class="actions">
        <a href="/b/{bubble.id}/attach">
          <div><i class="bi bi-reply"></i> 붙이기</div>
        </a>
        {#if mine}
        <a href="/b/{bubble.id}/delete">
          <div><i class="bi bi-trash"></i> 삭제</div>
        </a>
        {/if}
      </div>
    <slot></slot>
  </div>
</a>

<style>
  .bubble {
    padding: 10px;
    margin: 10px 0;
    border-left: 4px solid var(--primary-color);
  }
  .name {
    font-weight: bold;
    margin-bottom: 5px;
  }
  .content {
    margin-bottom: 5px;
  }
  .paragraph {
    margin-bottom: 5px;
  }
  .footer {
    font-size: 0.8em;
    color: #666 !important;
  }
  .actions {
    margin-top: 10px;
    display: flex;
    gap: 10px;
  }
</style>
