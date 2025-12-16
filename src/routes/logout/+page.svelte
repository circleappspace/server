<script>
  import { _ } from 'svelte-i18n';
  import Cookies from 'js-cookie';
  import { onMount } from 'svelte';

  onMount(() => {
    const token = Cookies.get("token");
    fetch("/api/v1/auth/logins", {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    Cookies.remove("token");
    Cookies.remove("username");
    Cookies.remove("id");
    window.location.href = "/";
  });
</script>

<div>{$_("logout.logging_out")}</div>
