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
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }).then(res => {
    return res.json();
  }).then(res => {
    return Promise.all(res.map(async bubble => {
      return { ...bubble, ...await loadBubble(fetch, bubble, token) };
    }));
  });

  return { bubbles };
}
