// Name of the Cache.
const CACHE = "mindfulnessAssistantCache_V2";

// Select files for caching.
let urlsToCache = [
  "/",
  "/index.html",
  "/index.js",
  "/index.css",
  "/favicon.png", 
];

// Cache all the selected items once application is installed.
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE)
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