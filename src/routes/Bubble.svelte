<script>
  export let bubble;

  let paragraphs = bubble.content.split('\n')
</script>

<div class="bubble">
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

<style>
  .bubble {
    border: 1px solid #ccc;
    padding: 10px;
    margin: 10px 0;
    border-radius: 5px;
    background-color: #f9f9f9;
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
    color: #666;
  }
</style>
