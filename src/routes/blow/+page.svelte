<script>
  import Cookies from 'js-cookie';

  let blowing = false;

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const content = formData.get('content');
    const token = Cookies.get('token');

    blowing = true;

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
      blowing = false;
    });
  }
</script>

<div>
  <form on:submit|preventDefault={handleSubmit}>
    <div>
      <textarea
        rows="10"
        placeholder="생각은 방울방울"
        name="content"
        ></textarea>
    </div>
    <div>
      {#if blowing}
        <button type="submit" disabled>버블 부는 중...</button>
      {:else}
        <button type="submit">버블 불기</button>
      {/if}
    </div>
  </form>
</div>
