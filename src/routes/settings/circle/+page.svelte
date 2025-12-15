<script>
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
      alert('자기소개는 256자 이내로 작성해주세요.');
      return;
    }
    if (name.length > 100) {
      alert('이름은 100자 이내로 작성해주세요.');
      return;
    }
    if (username.length > 50) {
      alert('핸들은 50자 이내로 작성해주세요.');
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
      console.error('Error:', error);
    });
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <div>핸들</div>
  <input type="text" name="username" value={username} pattern="[a-zA-Z0-9_]{'{'}1,50}" on:input={e => {
    e.target.setCustomValidity('핸들은 영문자, 숫자, 밑줄(_)만 사용할 수 있으며 50자 이내여야 합니다.');
  }} />
  <div>이름</div>
  <input type="text" name="name" value={name} pattern="[^\0]{'{'}1,100}" on:input={e => {
    e.target.setCustomValidity('이름은 100자 이내여야 합니다.');
  }} />
  <div>자기소개</div>
  <textarea name="bio">{bio}</textarea>
  <button type="submit">적용</button>
</form>
