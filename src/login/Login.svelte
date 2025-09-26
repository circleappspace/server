<script>
  import Layout from './../Layout.svelte';

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const username = formData.get('username');
    const password = formData.get('password_hash');

    fetch('/api/v1/logins', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    });
  }
</script>

<Layout>
  <form>
    <div>Username</div>
    <div>
      <input type="text" id="username" name="username" required />
    </div>
    <div>Password</div>
    <div>
      <input type="password" id="password" name="password" required />
    </div>
    <div>
      <button on:click={handleSubmit}>Login</button>
    </div>
  </form>
</Layout>
