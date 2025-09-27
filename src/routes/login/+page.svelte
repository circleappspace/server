<script>
  import Cookies from 'js-cookie';

  function handleSubmit(event) {
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
        window.location.href = '/';
      } else {
        alert('Login failed: ' + (data.error || 'Unknown error'));
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
    <button type="submit">Login</button>
  </div>
</form>
