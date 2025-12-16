export async function loadBubble(fetch, bubble, token, autoBubbleDepth = 1, autoBubbletCount = 2, noAnchorBubble = false) {
  const popped = await fetch(`/api/v1/bubbles/${bubble.id}/pops`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });

  const isPopped = await fetch(`/api/v1/bubbles/${bubble.id}/pops/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return response.json()
  }).then((data) => {
    return data.length > 0
  }).catch((error) => {
    console.error("Error:", error);
  });

  let bubblets = [];
  let anchorBubble = null;
  if (autoBubbletCount > 0 && autoBubbleDepth > 0) {
    bubblets = await fetch(`/api/v1/bubbles/${bubble.id}/anchoreds?count=${autoBubbletCount}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => Promise.all(data.map(async (bubblet) => {
        return {
          ...bubblet,
          ...await loadBubble(fetch, bubblet, token, autoBubbleDepth - 1, autoBubbletCount, true),
          noAnchorBubble: true
        };
      })))
      .catch((error) => console.error("Error:", error));
  }
  
  if (bubble.anchor && !noAnchorBubble) {
    await fetch(`/api/v1/bubbles/${bubble.anchor}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        anchorBubble = data;
      })
      .catch((error) => console.error("Error:", error));
  }

  return { popped, isPopped, bubblets, anchorBubble };
}