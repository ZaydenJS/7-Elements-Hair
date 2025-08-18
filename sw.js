// Service Worker for 7 Elements Hair
// Optimized for mobile performance

const CACHE_NAME = "7elements-v3";
const STATIC_CACHE = "7elements-static-v3";
const DYNAMIC_CACHE = "7elements-dynamic-v3";

// Critical resources to cache immediately
const STATIC_ASSETS = [
  "/",
  "/index.html",
  // Remove CSS from pre-cache to avoid stale styles
  // "/new-styles.min.css",
  "/new-script.js",
  "/Main-Logo-300.png",
  "/Photos/Hero-800.jpg",
];

// Install event - cache critical resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(
              (cacheName) =>
                cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE
            )
            .map((cacheName) => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event with network-first for CSS to avoid stale styles
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  if (!request.url.startsWith(self.location.origin)) return;

  if (request.destination === "style") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(DYNAMIC_CACHE).then((c) => c.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }
          const copy = response.clone();
          caches.open(DYNAMIC_CACHE).then((c) => c.put(request, copy));
          return response;
        })
        .catch(() => {
          if (request.destination === "document") {
            return caches.match("/index.html");
          }
        });
    })
  );
});
