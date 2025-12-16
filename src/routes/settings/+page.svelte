<script>
  import { _ } from 'svelte-i18n';
  import "bootstrap-icons/font/bootstrap-icons.css";
  import Cookies from 'js-cookie';

  let isSeeAllBubbles = Cookies.get('seeAllBubbles') === 'true';

  function seeAllBubbles(event) {
    if (event.target.checked) {
      Cookies.set('seeAllBubbles', 'true');
    } else {
      Cookies.remove('seeAllBubbles');
    }
  }
</script>

<div class="settings-item">
  <a href="/settings/circle"><i class="bi bi-person-circle"></i> {$_("settings.circle")}</a>
</div>
<div class="settings-item">
  <i class="bi bi-calendar"></i>
  {$_("settings.see_all_bubbles")}
  <input type="checkbox" on:change={seeAllBubbles} checked={isSeeAllBubbles}/>
</div>

<style>
  .settings-item {
    padding: 1rem;
  }
  .settings-item a {
    text-decoration: none;
    color: #343a40;
    font-weight: 500;
    display: flex;
    align-items: center;
  }
  .settings-item a:hover {
    color: #007bff;
  }
  .bi {
    margin-right: 0.5rem;
  }
  input[type="checkbox"] {
    margin-left: 1rem;
  }
</style>
