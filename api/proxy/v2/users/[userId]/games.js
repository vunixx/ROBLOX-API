import { forwardFetch } from '../../../fetchForward.js';

export default async function handler(req, res) {
  const { userId } = req.query;
  const qs = req.url.split('?')[1] || '';

  const target = `https://games.roblox.com/v2/users/${userId}/games${qs ? `?${qs}` : ''}`;

  const forwarded = await forwardFetch(target, req, { ttl: 30000 });
  const body = await forwarded.text();

  res.status(forwarded.status)
     .set(Object.fromEntries(forwarded.headers))
     .send(body);
}
