<script>
  import { _ } from 'svelte-i18n';

  function handleSubmit(event) {
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const username = formData.get('username');
    const password = formData.get('password');

    fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, username, password })
    }) .then(response => response.json())
      .then(data => {
        if (data.message === "OK") {
          window.location.href = '/login';
        } else {
          alert('Registration failed: ' + (data.error || 'Unknown error'));
        }
      })
      .catch((error) => {
        alert('Error:', error);
      });
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <div><label for="name">{$_("register.name")}</label></div>
  <div><input id="name" name="name" type="text" /></div>
  <div><label for="username">{$_("register.username")}</label></div>
  <div><input id="username" name="username" type="text" /></div>
  <div><label for="password">{$_("register.password")}</label></div>
  <div><input id="password" name="password" type="password" /></div>
  <div><button type="submit">{$_("register.register")}</button></div>
</form>
