import Cookies from 'js-cookie';

export async function load(data) {
  const fetch = data.fetch;
  const username = Cookies.get('username');
  const seeAllBubbles = Cookies.get('seeAllBubbles');

  let url = "/api/v1/bubbles";
  if (username && seeAllBubbles !== 'true') {
    url = "/api/v1/feed"
  }

  const token = Cookies.get('token');

  const bubbles = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.json());

  return { bubbles };
}
