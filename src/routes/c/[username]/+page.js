export async function load({ parent, fetch }) {
  const parentData = await parent();
  const bubbles = await fetch(`/api/v1/circles/${parentData.circle.id}/bubbles`)
    .then((res) => res.json());

  return { bubbles, ...parentData };
}
