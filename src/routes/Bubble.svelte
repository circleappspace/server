<script>
  export let bubble;
</script>

<div class="bubble">
  <div>{bubble.circle.name} · c/{bubble.circle.username}</div>
  <div>{bubble.content}</div>
  <div>{new Date(bubble.timestamp).toLocaleString()}</div>
</div>
