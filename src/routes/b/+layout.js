import { loadBubble } from '../Bubble.js';
import Cookies from 'js-cookie';

export async function load({ fetch, params }) {
  const bubbleId = params.bubbleId;
  const token = Cookies.get('token');

  let bubble = await fetch(`/api/v1/bubbles/${bubbleId}`)
    .then((res) => res.json())
    .then(async (bubble) => {
      return {
        ...bubble,
        ...await loadBubble(fetch, bubble, token, 10, 100)
      };
    });

  return { bubble };
}
