<script>
  import { _ } from 'svelte-i18n';
  import { onMount } from 'svelte';
  import Cookies from 'js-cookie';

  let name = '';
  let bio = '';

  let username = Cookies.get('username');
  const token = Cookies.get('token');

  onMount(() => {
    fetch(`/api/v1/circles/username/${username}`)
      .then(response => response.json())
      .then(data => {
        name = data.name || '';
        bio = data.bio || '';
        username = data.username || '';
      })
      .catch(error => {
        console.error('Error fetching profile data:', error);
      });
  });

  function handleSubmit(event) {
    const formData = new FormData(event.target);
    name = formData.get('name');
    bio = formData.get('bio');
    username = formData.get('username');

    if (bio.length > 256) {
      alert($_("settings.circle.bio_too_long"));
      return;
    }
    if (name.length > 100) {
      alert($_("settings.circle.name_too_long"));
      return;
    }
    if (username.length > 50) {
      alert($_("settings.circle.username_too_long"));
      return;
    }

    fetch(`/api/v1/circles`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, bio, username })
    })
    .then(response => response.json())
    .then(data => {
      Cookies.set('username', username);
      window.location.href = `/c/${username}`;
    })
    .catch((error) => {
      console.error($_("settings.circle.update_error"), error);
    });
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <div>{$_("settings.circle.username")}</div>
  <input type="text" name="username" value={username} pattern="[a-zA-Z0-9_]{'{'}1,50}" on:input={e => {
    e.target.setCustomValidity($_("settings.circle.invalid_username"));
  }} />
  <div>{$_("settings.circle.name")}</div>
  <input type="text" name="name" value={name} pattern="[^\0]{'{'}1,100}" on:input={e => {
    e.target.setCustomValidity($_("settings.circle.name_too_long"));
  }} />
  <div>{$_("settings.circle.bio")}</div>
  <textarea name="bio" bind:value={bio}></textarea>
  <button type="submit">{$_("settings.circle.update")}</button>
</form>

<style>
  textarea {
    resize: vertical;
  }
</style>
