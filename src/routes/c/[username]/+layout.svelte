<script>
  import Timeline from "../..//Timeline.svelte";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Cookies from "js-cookie";

  export let data;

  let username = $page.params.username;
  let circle = data.circle;
</script>

<Timeline {username} />
<div class="circle-info">
  <div class="name">{circle.name}</div>
  <div class="username">c/{circle.username}</div>
  <div class="bio">{circle.bio}</div>
</div>
<slot {circle} />

<style>
  .circle-info {
    text-align: center;
    margin: 20px 0;
  }

  .name {
    font-size: 24px;
    font-weight: bold;
  }

  .username {
    font-size: 18px;
    color: #666;
  }

  .bio {
    margin-top: 10px;
    font-size: 16px;
    color: #333;
  }

</style>
