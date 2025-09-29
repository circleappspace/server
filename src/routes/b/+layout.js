export async function load({ fetch, params }) {
  const bubbleId = params.bubbleId;
  const bubble = await fetch(`/api/v1/bubbles/${bubbleId}`)
    .then((res) => res.json());
  return { bubble };
}
