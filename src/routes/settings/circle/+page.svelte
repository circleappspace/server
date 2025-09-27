<script>
  import { onMount } from 'svelte';
  import Cookies from 'js-cookie';

  let name = '';
  let bio = '';

  const username = Cookies.get('username');
  const token = Cookies.get('token');

  onMount(() => {
    fetch(`/api/v1/circles/username/${username}`)
      .then(response => response.json())
      .then(data => {
        name = data.name || '';
        bio = data.bio || '';
      })
      .catch(error => {
        console.error('Error fetching profile data:', error);
      });
  });

  function handleSubmit(event) {
    const formData = new FormData(event.target);
    name = formData.get('name');
    bio = formData.get('bio');

    fetch(`/api/v1/circles`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, bio })
    })
    .then(response => response.json())
    .then(data => {
      window.location.href = `/c/${username}`;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <div>Name</div>
  <input type="text" name="name" value={name}/>
  <div>Bio</div>
  <textarea name="bio">{bio}</textarea>
  <button type="submit">Submit</button>
</form>
