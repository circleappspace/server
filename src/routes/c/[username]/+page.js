import { loadBubble } from "../../Bubble";

export async function load({ parent, fetch }) {
  const parentData = await parent();
  const bubbles = await fetch(`/api/v1/circles/${parentData.circle.id}/bubbles`)
    .then((res) => res.json())
    .then((res) => {
      return Promise.all(res.map(async (bubble) => {
        return {
          ...bubble,
          ...await loadBubble(fetch, bubble, parentData.token),
        };
      }));
    });

  return { bubbles, ...parentData };
}
