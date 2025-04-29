// Name of the Cache.
const CACHE_NAME = "mindfulnessAssistantCache_V3";

// Select files for caching.
let urlsToCache = [
  "/",
  "/index.html",
  "/index.js",
  "/index.css",
  "/favicon.png", 
  "assets/sounds/exhale.mp3",
  "assets/sounds/inhale.mp3",
  "assets/sounds/hold.mp3",
];

// Cache all the selected items once application is installed.
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME)
    .then((cache) => (cache.addAll(urlsToCache)))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request)
    .then((response) => {
      if (response) return response;

      return fetch(event.request);
    })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      console.info("Pruning", cacheNames);
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});