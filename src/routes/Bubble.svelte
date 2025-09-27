<script>
  import { onMount } from "svelte";

  export let bubble;

  let paragraphs = [];
  onMount(() => {
    paragraphs = bubble.content.split("\n").filter((p) => p.trim() !== "");
  });
</script>

<a href="/b/{bubble.id}" style="text-decoration: none; color: inherit;">
  <div class="bubble">
    <div class="self">
      <div class="name">{bubble.circle.name}</div>
      <div class="content">
        {#each paragraphs as paragraph}
        <div class="paragraph">{paragraph}</div>
        {/each}
      </div>
      <div class="footer">
        {new Date(bubble.timestamp).toLocaleString()}
        ·
        <a href="/c/{bubble.circle.username}">c/{bubble.circle.username}</a>
      </div>
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
</style>
