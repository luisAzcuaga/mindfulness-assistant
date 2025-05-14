// Name of the Cache.
const CACHE_NAME = "mindfulnessAssistantCache_V11";

// Select files for caching.
const urlsToCache = [
  "/",
  "/index.html",
  "/index.js",
  "/index.css",
  "/favicon.ico",
  "/manifest.json",
  "./assets/sounds/sound-mix.mp3",
  "./assets/icons/android-chrome-192x192.png",
  "./assets/icons/android-chrome-512x512.png",
  "./assets/icons/apple-touch-icon.png",
  "./assets/icons/favicon-16x16.png",
  "./assets/icons/favicon-32x32.png",
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
    caches.keys()
      .then((cacheNames) => (
        Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        )
      ))
  );
});