export const Cache = (() => {
  if (!global._VERCEL_ROPROXY_CACHE) {
    global._VERCEL_ROPROXY_CACHE = new Map();
  }
  const map = global._VERCEL_ROPROXY_CACHE;

  function get(key) {
    const v = map.get(key);
    if (!v) return null;
    if (Date.now() > v.expire) {
      map.delete(key);
      return null;
    }
    return v.value;
  }

  function set(key, value, ttl = 30000) {
    map.set(key, { value, expire: Date.now() + ttl });
  }

  return { get, set };
})();
