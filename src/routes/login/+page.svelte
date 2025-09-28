<script>
  import Cookies from 'js-cookie';

  let loggingIn = false;

  function handleSubmit(event) {
    loggingIn = true;

    event.preventDefault();
    const formData = new FormData(event.target);
    const username = formData.get('username');
    const password = formData.get('password');

    fetch('/api/v1/auth/logins', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        Cookies.set('token', data.token);
        Cookies.set('username', username);
        Cookies.set('id', data.circle.id);
        window.location.href = '/';
      } else {
        alert('Login failed: ' + (data.error || 'Unknown error'));
        loggingIn = false;
      }
    });
  }
</script>

<form on:submit={handleSubmit}>
  <div>Username</div>
  <div>
    <input type="text" id="username" name="username" required />
  </div>
  <div>Password</div>
  <div>
    <input type="password" id="password" name="password" required />
  </div>
  <div>
    {#if !loggingIn}
      <button type="submit">Login</button>
    {:else}
      <button type="submit" disabled>Logging in...</button>
    {/if}
  </div>
</form>
