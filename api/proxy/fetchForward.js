import { Cache } from './utils/cache.js';

export async function forwardFetch(targetUrl, req, options = {}) {
  const cacheKey = `${req.method}:${targetUrl}` + (req.url.search || '');
  const useCache = options.cache !== false;

  if (useCache) {
    const cached = Cache.get(cacheKey);
    if (cached) return cached;
  }

  const headers = {};
  if (req.headers['user-agent']) headers['user-agent'] = req.headers['user-agent'];
  if (req.headers['accept']) headers['accept'] = req.headers['accept'];

  if (process.env.PROXY_KEY) {
    if (!req.headers['proxykey'] || req.headers['proxykey'] !== process.env.PROXY_KEY) {
      return new Response(JSON.stringify({ error: 'proxykey invalid' }), { status: 403 });
    }
  }

  if (process.env.ROBLOX_API_KEY) {
    headers['x-api-key'] = process.env.ROBLOX_API_KEY;
  }

  const fetchOptions = {
    method: req.method,
    headers,
  };

  if (['POST', 'PUT', 'PATCH'].includes(req.method.toUpperCase())) {
    try {
      fetchOptions.body = await req.text();
    } catch {}
  }

  try {
    const r = await fetch(targetUrl, fetchOptions);
    const text = await r.text();
    const response = new Response(text, { status: r.status, headers: r.headers });

    if (useCache && r.ok) Cache.set(cacheKey, response.clone(), options.ttl || 30000);

    return response;
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
