<script>
  import Cookies from 'js-cookie';
  import "bootstrap-icons/font/bootstrap-icons.css";

  export let anchor;

  let media = [];

  let blowing = false;
  let textarea;

  function handleSubmit(e) {
    e.preventDefault();
    const content = textarea.value.trim();
    const token = Cookies.get('token');

    blowing = true;

    fetch("/api/v1/bubbles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ content, anchor, media })
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

  function uploadMedia() {
    const mediaInput = document.getElementById('mediaInput');
    mediaInput.click();
    mediaInput.onchange = () => {
      const file = mediaInput.files[0];
      if (!file) return;
      const token = Cookies.get('token');
      const formData = new FormData();
      formData.append('file', file);
      fetch('/api/v1/upload/media', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        media = [...media, data.url];
      })
      .catch(error => {
        alert('Error uploading media:', error);
      });
    };
  }
</script>

<div>
  <form on:submit={handleSubmit}>
    <div>
      <textarea
        rows="10"
        placeholder="생각은 방울방울"
        name="content"
        on:keydown={(e) => {
          if (e.key === 'Enter' && e.metaKey) {
            handleSubmit(e);
          }
        }}
        bind:this={textarea}
      ></textarea>
    </div>
    <div>
      {#if blowing}
        <button type="submit" disabled>버블 부는 중...</button>
      {:else}
        <button type="submit">버블 불기</button>
      {/if}
      <button class="icon-button" type="button" on:click={uploadMedia}>
        <i class="bi bi-image"></i>
      </button>
    </div>
  </form>
  <div class="media-preview">
    {#each media as url}
      <img src={url} alt="Uploaded media" style="max-width: 200px; max-height: 200px; margin: 5px;" />
    {/each}
  </div>
</div>
<input type="file" id="mediaInput" style="display: none;" />

<style>
  textarea {
    resize: none;
  }

  .icon-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.5em;
    vertical-align: middle;
  }

  .icon-button:focus {
    outline: none;
  }

  .media-preview {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .media-preview img {
    margin: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
    max-width: 100px;
    max-height: 100px;
  }
</style>
