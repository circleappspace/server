<script>
  export let circles = [];
</script>

{#if circles.length === 0}
  <div>서클이 없습니다.</div>
{:else}
  {#each circles as circle (circle.id)}
    <div class="circle-card">
      <a href={`/c/${circle.username}`} class="circle-link">
        <div class="circle-name">{circle.name}</div>
        <div class="circle-username">c/{circle.username}</div>
      </a>
    </div>
  {/each}
{/if}

<style>
  .circle-card {
    padding: 15px;
    border-radius: 8px;
    transition: 0.2s background-color;
  }

  .circle-card:hover {
    background-color: var(--hover-color);
  }

  .circle-link {
    text-decoration: none;
    color: inherit;
  }

  .circle-name {
    font-size: 1.2em;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .circle-username {
    font-size: 0.9em;
    color: #6c757d;
  }
</style>
