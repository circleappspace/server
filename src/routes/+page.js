import { loadBubble } from './Bubble.js';
import Cookies from 'js-cookie';

export async function load({ fetch }) {
  const username = Cookies.get('username');
  const seeAllBubbles = Cookies.get('seeAllBubbles');

  const token = Cookies.get('token');

  let url = "/api/v1/bubbles";
  if (token && username && seeAllBubbles !== 'true') {
    url = "/api/v1/feed"
  }

  const bubbles = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(async res => {
    res = await res.json();
    for (let i = 0; i < res.length; i++) {
      res[i] = {...res[i], ...await loadBubble(fetch, res[i], token)};
    }
    return res;
  })

  return { bubbles };
}
