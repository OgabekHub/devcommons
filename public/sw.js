const CACHE_NAME = 'devcommons-v3';
const urlsToCache = [
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

// Install event - cache static setup safely
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((err) => console.log('SW install error:', err))
  );
  self.skipWaiting();
});

// Activate event - instantly clean up ALL old caches (v1, v2) and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Purging old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Network-First Strategy for live apps (fall back to cache only when offline)
self.addEventListener('fetch', (event) => {
  // Only handle GET requests and valid HTTP schemes
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  const url = new URL(event.request.url);

  // Never cache API calls or Auth OAuth callback exchanges
  if (url.pathname.startsWith('/api') || url.pathname.includes('/auth/callback')) {
    return;
  }

  // Network-First guarantees fresh content immediately on normal page reload!
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Clone and update cache with the freshest version if successful
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache).catch(() => {});
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // If offline or network unavailable, fall back to whatever is cached
        return caches.match(event.request);
      })
  );
});
