import { forwardFetch } from '../../../fetchForward.js';

export default async function handler(req, res) {
  const { gameId } = req.query;
  const target = `https://games.roblox.com/v1/games/${gameId}/game-passes?limit=100`;

  const forwarded = await forwardFetch(target, req, { ttl: 30000 });
  const body = await forwarded.text();

  res.status(forwarded.status)
     .set(Object.fromEntries(forwarded.headers))
     .send(body);
}
