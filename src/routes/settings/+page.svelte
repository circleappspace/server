<script>
  import { _ } from 'svelte-i18n';
  import "bootstrap-icons/font/bootstrap-icons.css";
  import Cookies from 'js-cookie';
  import { userLanguage, setLanguage } from '$lib/i18n/store';

  let isSeeAllBubbles = Cookies.get('seeAllBubbles') === 'true';

  function seeAllBubbles(event) {
    if (event.target.checked) {
      Cookies.set('seeAllBubbles', 'true');
    } else {
      Cookies.remove('seeAllBubbles');
    }
  }

  function toggleLanguage() {
    const newLang = $userLanguage === 'en' ? 'ko' : 'en';
    setLanguage(newLang);
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
<button type="button" class="settings-item" on:click={toggleLanguage}>
  <i class="bi bi-translate"></i> {$_("settings.language")}
</button>

<style>
  .settings-item {
    margin: 1rem;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    font-size: 1rem;
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
    margin-bottom: 0;
  }
  button.settings-item {
    display: block;
    padding: 0;
  }
</style>
