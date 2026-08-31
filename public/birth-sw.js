/* Service worker for /birth — the labor support tool.
   Scope is limited to /birth so it never touches the rest of the site.
   Strategy: serve from cache first (hospital wifi is assumed broken),
   refresh in the background when there happens to be a network. */

const CACHE = "birth-v7";
const ASSETS = ["/birth", "/birth.html", "/birth-content.js", "/birth.webmanifest"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      // addAll is all-or-nothing; cache each one so a single 404 can't
      // leave the phone with no offline copy at all.
      .then((c) => Promise.all(ASSETS.map((u) => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  // The sync API must always hit the network -- a cached plan would be a
  // stale plan, and the client already has its own offline copy.
  if (new URL(req.url).pathname.startsWith("/api/")) return;

  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      const net = fetch(req)
        .then((res) => {
          if (res && res.ok && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => hit || caches.match("/birth.html") || caches.match("/birth"));
      return hit || net;
    })
  );
});
