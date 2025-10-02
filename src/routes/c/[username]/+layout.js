export async function load({ params, fetch }) {
    const res = await fetch(`/api/v1/circles/username/${params.username}`);
    const circle = await res.json();
    return { circle };
}
