import Cookies from 'js-cookie';

export async function load({ fetch }) {
  const token = Cookies.get('token');
  const notifications = await fetch('/api/v1/notifications', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(res => res.json());

  const username = Cookies.get('username');

  return {
    notifications, username
  };
}
