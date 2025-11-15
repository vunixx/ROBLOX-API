import { forwardFetch } from './fetchForward.js';

export default async function handler(req, res) {
  const path = req.url.replace(/^\//, '');
  let finalTarget = `https://${path}`;

  if (!/^https?:\/\//i.test(finalTarget)) {
    finalTarget = `https://games.roblox.com/${path}`;
  }

  const forwarded = await forwardFetch(finalTarget, req, { ttl: 15000 });
  const body = await forwarded.text();

  res.status(forwarded.status)
     .set(Object.fromEntries(forwarded.headers))
     .send(body);
}
