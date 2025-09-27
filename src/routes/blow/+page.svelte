<script>
  import Cookies from 'js-cookie';

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const content = formData.get('content');
    const token = Cookies.get('token');

    fetch("/api/v1/bubbles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    })
    .then(response => response.json())
    .then(data => {
      window.location.href = "/";
    })
    .catch((error) => {
      alert('Error:', error);
    });
  }
</script>

<div>
  <form on:submit|preventDefault={handleSubmit}>
    <div>
      <textarea
        rows="10"
        cols="50"
        placeholder="Enter your text here..."
        name="content"
        ></textarea>
    </div>
    <div>
      <button type="submit">불기</button>
    </div>
  </form>
</div>
